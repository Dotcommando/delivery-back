import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { lastValueFrom, timeout } from 'rxjs';

import { MAX_TIME_OF_REQUEST_WAITING, VENDORS_EVENTS } from '../common/constants';
import { AddressedErrorCatching, ApplyAddressedErrorCatching } from '../common/decorators';
import { IResponse } from '../common/types';
import { ICreateCompanyReq, ICreateCompanyRes } from '../types';


@ApplyAddressedErrorCatching
@Injectable()
export class CompaniesService {
  constructor(
    @Inject('VENDOR_SERVICE') private readonly vendorServiceClient: ClientProxy,
  ) {
  }

  @AddressedErrorCatching()
  public async createCompany(
    company: ICreateCompanyReq,
  ): Promise<IResponse<ICreateCompanyRes>> {
    return await lastValueFrom(
      this.vendorServiceClient
        .send(VENDORS_EVENTS.VENDOR_CREATE_COMPANY, company)
        .pipe(timeout(MAX_TIME_OF_REQUEST_WAITING)),
    );
  }
}
