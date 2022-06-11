import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { lastValueFrom, timeout } from 'rxjs';

import { MAX_TIME_OF_REQUEST_WAITING, USERS_EVENTS } from '../common/constants';
import { AddressedHttpException } from '../common/exceptions';
import { IResponse } from '../common/interfaces';
import { SignInDto } from '../dto';
import { ISignInRes, IValidateUserRes } from '../types';


@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
  ) {
  }

  public async validateUser(user: SignInDto): Promise<IResponse<IValidateUserRes>> {
    const address = 'Gateway >> AuthService >> validateUser';

    if ((!('username' in user) && !('email' in user)) || (!user.username && !user.email)) {
      throw new AddressedHttpException(
        address,
        'Something one required: email or username',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await lastValueFrom(
      this.userServiceClient
        .send(USERS_EVENTS.USER_VALIDATE_USER, user)
        .pipe(timeout(MAX_TIME_OF_REQUEST_WAITING)),
    );
  }

  public async signIn(user: SignInDto): Promise<IResponse<ISignInRes>> {
    return await lastValueFrom(
      this.userServiceClient
        .send(USERS_EVENTS.USER_ISSUE_TOKENS, user)
        .pipe(timeout(MAX_TIME_OF_REQUEST_WAITING)),
    );
  }
}
