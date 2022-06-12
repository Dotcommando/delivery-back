import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model, Types } from 'mongoose';

import { EMAIL_REGEXP, USERNAME_REGEXP } from '../common/constants';
import { PartialUserDto } from '../common/dto';
import { AddressedHttpException } from '../common/exceptions';
import { createAddressedException } from '../common/helpers';
import { ITokenDocument, IUser, IUserDocument } from '../common/types';
import { DEFAULT_USER_DATA } from '../constants';
import { IEmailPassword, IUsernamePassword, IValidateUserRes, UserCredentialsReq } from '../types';
import { RefreshTokenData } from '../types/refresh-token-data.type';


@Injectable()
export class DbAccessService {
  constructor(
    @InjectModel('Token') private readonly tokenModel: Model<ITokenDocument>,
    @InjectModel('User') private readonly userModel: Model<IUserDocument>,
  ) {
  }

  public async checkUsernameOccupation(username: string): Promise<{ occupied: boolean }> {
    if (typeof username !== 'string' || !USERNAME_REGEXP.test(username)) {
      throw new AddressedHttpException(
        'Users >> DBAccessService >> checkUsernameOccupation',
        'Email is not valid',
        HttpStatus.BAD_REQUEST,
      );
    }

    const userDoc = await this.userModel.findOne({ username });

    return { occupied: Boolean(userDoc) };
  }

  public async checkEmailOccupation(email: string): Promise<{ occupied: boolean }> {
    if (typeof email !== 'string' || !EMAIL_REGEXP.test(email)) {
      throw new AddressedHttpException(
        'Users >> DBAccessService >> checkEmailOccupation',
        'Email is not valid',
        HttpStatus.BAD_REQUEST,
      );
    }

    const userDoc = await this.userModel.findOne({ email });

    return { occupied: Boolean(userDoc) };
  }

  public async validateUser(user: UserCredentialsReq): Promise<IValidateUserRes> {
    const emailDefined = 'email' in user;

    if ((!('username' in user) && !(emailDefined)) || (!(user as IUsernamePassword).username && !(user as IEmailPassword).email)) {
      throw new BadRequestException('Something one required: email or username');
    }

    const userDoc: IUserDocument = await this.userModel.findOne({
      ...(emailDefined && { email: (user as IEmailPassword).email }),
      ...(!emailDefined && { username: (user as IUsernamePassword).username }),
    });

    const userIsValid = userDoc
      ? userDoc.compareEncryptedPassword(user.password)
      : false;

    return {
      userIsValid,
      ...(userIsValid && { user: userDoc.toJSON() as IUser }),
    };
  }

  public async saveNewUser(user: PartialUserDto): Promise<{ user: IUser }> {
    try {
      const userDoc: IUserDocument = new this.userModel({ ...DEFAULT_USER_DATA, ...user });
      const savedUserDoc = await userDoc.save();

      return { user: savedUserDoc.toJSON() as IUser };
    } catch (e) {
      createAddressedException('Users >> DBAccessService >> saveNewUser', e);
    }
  }

  public async saveRefreshToken(token: RefreshTokenData): Promise<{ saved: boolean }> {
    try {
      const newToken = new this.tokenModel(token);
      const saved = await newToken.save();

      return {
        saved: Boolean(saved),
      };
    } catch (e) {
      return {
        saved: false,
      };
    }
  }

  public async checkAccessToken(accessToken): Promise<{ blacklisted: boolean }> {
    try {
      const tokenDoc: ITokenDocument | null = await this.tokenModel.findOne({ accessToken });

      return {
        blacklisted: tokenDoc
          ? tokenDoc.blacklisted
          : false,
      };
    } catch (e) {
      createAddressedException('Users >> DBAccessService >> checkAccessToken', e);
    }
  }

  public async findManyUsers(userIds: Array<string | Types.ObjectId>): Promise<IUser[] | null> {
    try {
      const ids = userIds.map((userId: string | Types.ObjectId) => new Types.ObjectId(userId));
      const userDocs: IUserDocument[] = await this.userModel.find({
        _id: { $in: ids },
      });

      if (!userDocs || !userDocs.length) {
        return null;
      }

      return userDocs.map((userDoc: IUserDocument) => userDoc.toJSON());
    } catch (e) {
      createAddressedException('Users >> DBAccessService >> findManyUsers', e);
    }
  }

  public async findUserById(userId: string | Types.ObjectId): Promise<IUser | null> {
    return (await this.findManyUsers([userId]))?.[0] ?? null;
  }
}
