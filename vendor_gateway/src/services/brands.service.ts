import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { lastValueFrom } from 'rxjs';

import { VENDORS_EVENTS } from '../common/constants';
import { ApplyAddressedErrorCatching } from '../common/decorators';
import { IResponse } from '../common/types';
import { ICreateBrandRes } from '../types';


@ApplyAddressedErrorCatching
@Injectable()
export class BrandsService {
  constructor(
    @Inject('VENDOR_SERVICE') private readonly vendorServiceClient: ClientProxy,
  ) {
  }

  public async createBrand(body): Promise<IResponse<ICreateBrandRes>> {
    return await lastValueFrom(
      this.vendorServiceClient.send(VENDORS_EVENTS.VENDOR_CREATE_BRAND, body),
    );
  }
}
