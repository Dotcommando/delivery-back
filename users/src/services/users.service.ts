import { BadRequestException, ConflictException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';

import { Model, Types } from 'mongoose';

import { DbAccessService } from './db-access.service';

import { LOGIN_ORIGIN } from '../common/constants';
import { PartialUserDto } from '../common/dto';
import { AddressedHttpException } from '../common/exceptions';
import { IResponse, IUser, IUserDocument } from '../common/interfaces';
import { RegisterDto, SignInDto } from '../dto';
import { ISignInRes, IValidateUserRes, UserCredentialsReq } from '../types';


@Injectable()
export class UsersService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private dbAccessService: DbAccessService,
    @InjectModel('User') private readonly userModel: Model<IUserDocument>,
  ) {
  }

  public async checkUsername(user: PartialUserDto): Promise<{ occupied: boolean }> {
    return this.dbAccessService.checkUsernameOccupation(user.username);
  }

  public async checkEmail(user: PartialUserDto): Promise<{ occupied: boolean }> {
    return this.dbAccessService.checkEmailOccupation(user.email);
  }

  public async register(user: RegisterDto): Promise<IResponse<{ user: IUser }>> {
    const errorAddress = 'Users >> UsersService >> register';
    const usernameRequired = 'username' in user;

    const requestsToCheck = [
      this.checkEmail(user),
      ...(usernameRequired ? [this.checkUsername(user)] : []),
    ];
    const checkResults: PromiseSettledResult<{ occupied: boolean }>[] = await Promise.allSettled(requestsToCheck);

    if (checkResults[0].status === 'rejected' || (usernameRequired && checkResults[1].status === 'rejected')) {
      throw new AddressedHttpException(errorAddress, 'Cannot check occupation of email or username', HttpStatus.PRECONDITION_FAILED);
    } else if (checkResults[0].value.occupied) {
      throw new ConflictException(`Email ${user.email} occupied`);
    } else if (usernameRequired && (checkResults[1] as PromiseFulfilledResult<{ occupied: boolean }>)?.value?.occupied) {
      throw new ConflictException(`Username ${user.username} occupied`);
    }

    const newUserResponse: { user: IUser } = await this.dbAccessService.saveNewUser(user);

    return {
      status: HttpStatus.CREATED,
      data: {
        user: newUserResponse.user,
      },
      errors: null,
    };
  }

  public async validateUser(user: SignInDto): Promise<IResponse<IValidateUserRes>> {
    if ((!('username' in user) && !('email' in user)) || (!user.username && !user.email)) {
      throw new BadRequestException('Something one required: email or username');
    }

    const validationResult: IValidateUserRes = await this.dbAccessService.validateUser(user as UserCredentialsReq);

    return {
      status: HttpStatus.OK,
      data: validationResult,
      errors: null,
    };
  }

  public async issueTokens(user: SignInDto): Promise<IResponse<ISignInRes>> {
    const validateUserResponse = await this.validateUser(user);

    if (!validateUserResponse.data?.user) {
      const emailIsDefined = 'email' in user;

      throw new UnauthorizedException(
        `User with such ${emailIsDefined ? 'email' : 'username'} ${emailIsDefined ? user.email : user.username} and password not found or password is wrong`,
      );
    }

    const validUser: IUser = { ...validateUserResponse.data.user };
    const userId = String(validUser._id);
    const options = { secret: this.configService.get('secretKey') };
    const now = Date.now();
    const accessTokenExpiredAfter = now + this.configService.get('accessTokenExpiresIn');
    const refreshTokenExpiredAfter = now + this.configService.get('refreshTokenExpiresIn');

    const accessToken = this.jwtService.sign(
      {
        sub: userId,
        aud: this.configService.get('audience'),
        iss: this.configService.get('issuer'),
        azp: this.configService.get('authorizedParty'),
        exp: accessTokenExpiredAfter,
        iat: now,
        loginOrigin: LOGIN_ORIGIN.USERNAME_PASSWORD,
      },
      options,
    );

    const refreshToken = this.jwtService.sign(
      {
        sub: userId,
        aud: this.configService.get('audience'),
        iss: this.configService.get('issuer'),
        azp: this.configService.get('CSAuthParty'),
        exp: refreshTokenExpiredAfter,
        iat: now,
        loginOrigin: LOGIN_ORIGIN.USERNAME_PASSWORD,
      },
      options,
    );

    await this.dbAccessService.saveRefreshToken({
      userId: validUser._id,
      refreshToken: refreshToken,
      issuedForUserAgent: new Types.ObjectId(),
      issuedAt: new Date(now),
      expiredAfter: new Date(refreshTokenExpiredAfter),
      blacklisted: false,
    });

    return {
      status: HttpStatus.OK,
      data: {
        user: validUser,
        accessToken,
        refreshToken,
        accessTokenExpiredAfter,
        refreshTokenExpiredAfter,
      },
      errors: null,
    };
  }
}
