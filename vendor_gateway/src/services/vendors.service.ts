import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { lastValueFrom, timeout } from 'rxjs';

import { FileBase64Class } from '../common/classes';
import { MAX_TIME_OF_REQUEST_WAITING, VENDORS_EVENTS } from '../common/constants';
import { FileBase64, IResponse } from '../common/types';
import { IDeleteVendorData, ILogoutRes, IUpdateVendorData } from '../types';


@Injectable()
export class VendorsService {
  constructor(
    @Inject('VENDOR_SERVICE') private readonly vendorServiceClient: ClientProxy,
  ) {
  }

  public async updateVendor(data: IUpdateVendorData) {
    if ('avatar' in data) {
      const avatarBase64: FileBase64 = new FileBase64Class(data.avatar);
      console.log(' ');
      console.log('avatarBase64:');
      console.log(avatarBase64);
    }

    if ((!data.body.email && !data.body.phoneNumber) || !Boolean(data.user)) {
      return await lastValueFrom(
        this.vendorServiceClient
          .send(VENDORS_EVENTS.VENDOR_UPDATE_VENDOR, { ...data.body, _id: data._id })
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
      this.vendorServiceClient
        .send(VENDORS_EVENTS.VENDOR_UPDATE_VENDOR, { ...bodyUpdated, _id })
        .pipe(timeout(MAX_TIME_OF_REQUEST_WAITING)),
    );
  }

  public async deleteUser(data: IDeleteVendorData): Promise<IResponse<ILogoutRes>> {
    const { _id, user } = data;

    if (!user || String(user._id) !== String(user._id)) {
      return {
        status: HttpStatus.BAD_REQUEST,
        data: null,
        errors: ['Defined id parameter does not match user id'],
      };
    }

    return await lastValueFrom(
      this.vendorServiceClient
        .send(VENDORS_EVENTS.VENDOR_DELETE_USER, { _id })
        .pipe(timeout(MAX_TIME_OF_REQUEST_WAITING)),
    );
  }
}
