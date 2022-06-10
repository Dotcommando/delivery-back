import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { PartialUserDto } from '../common/dto';
import { AddressedHttpException } from '../common/exceptions';
import { createAddressedException } from '../common/helpers';
import { IResponse, IUserDocument, IUserSafe } from '../common/interfaces';
import { DEFAULT_USER_DATA } from '../constants/default-user-data.constant';
import { RegisterDto } from '../dto';


@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<IUserDocument>,
  ) {
  }

  public async checkUsername(user: PartialUserDto): Promise<{ occupied: boolean }> {
    try {
      if (!('username' in user)) {
        return { occupied: false };
      }

      const userDoc = await this.userModel.findOne({ username: user.username });

      return { occupied: Boolean(userDoc) };
    } catch (e) {
      createAddressedException('Users >> UsersService >> checkUsername', e);
    }
  }

  public async checkEmail(user: PartialUserDto): Promise<{ occupied: boolean }> {
    try {
      const userDoc = await this.userModel.findOne({ email: user.email });

      return { occupied: Boolean(userDoc) };
    } catch (e) {
      createAddressedException('Users >> UsersService >> checkEmail', e);
    }
  }

  public async register(user: RegisterDto): Promise<IResponse<{ user: IUserSafe }>> {
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
      throw new AddressedHttpException(errorAddress, `Email ${user.email} occupied`, HttpStatus.CONFLICT);
    } else if (usernameRequired && (checkResults[1] as PromiseFulfilledResult<{ occupied: boolean }>)?.value?.occupied) {
      throw new AddressedHttpException(errorAddress, `Username ${user.username} occupied`, HttpStatus.CONFLICT);
    }

    const userDoc: IUserDocument = new this.userModel({ ...DEFAULT_USER_DATA, ...user });
    const savedUserDoc = await userDoc.save();

    return {
      status: HttpStatus.CREATED,
      data: {
        user: savedUserDoc?.toJSON() as IUserSafe,
      },
      errors: null,
    };
  }
}
