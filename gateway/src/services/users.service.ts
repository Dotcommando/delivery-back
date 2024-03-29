import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { lastValueFrom, timeout } from 'rxjs';

import { MAX_TIME_OF_REQUEST_WAITING, USERS_EVENTS } from '../common/constants';
import { IUpdateUserData } from '../types';


@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
  ) {
  }

  public async updateUser(data: IUpdateUserData) {
    if (data.user && String(data._id) !== String(data.user._id)) {
      return {
        status: HttpStatus.FORBIDDEN,
        data: null,
        errors: ['You can update yourself only'],
      };
    }

    if ((!data.body.email && !data.body.phoneNumber) || !Boolean(data.user)) {
      return await lastValueFrom(
        this.userServiceClient
          .send(USERS_EVENTS.USER_UPDATE_USER, { ...data.body, _id: data._id })
          .pipe(timeout(MAX_TIME_OF_REQUEST_WAITING)),
      );
    }

    const { body, _id, user } = data;
    const bodyUpdated = { ...body };

    if (bodyUpdated.phoneNumber === user.phoneNumber) {
      delete bodyUpdated.phoneNumber;
    }

    if (bodyUpdated.email === user.email) {
      delete bodyUpdated.email;
    }

    return await lastValueFrom(
      this.userServiceClient
        .send(USERS_EVENTS.USER_UPDATE_USER, { ...bodyUpdated, _id })
        .pipe(timeout(MAX_TIME_OF_REQUEST_WAITING)),
    );
  }
}
