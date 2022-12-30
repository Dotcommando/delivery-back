import { HttpStatus, Injectable, PreconditionFailedException, UseFilters } from '@nestjs/common';

import { CompanyDbAccessService } from './company-db-access.service';

import { AddressedErrorCatching, ApplyAddressedErrorCatching } from '../common/decorators';
import { TcpCommonExceptionFilter } from '../common/filters';
import { ICompany, IResponse } from '../common/types';
import { IUpdateCompanyReq } from '../types';
import { ICreateCompanyReq, ICreateCompanyRes, IUpdateCompanyRes } from '../types';


@ApplyAddressedErrorCatching
@UseFilters(new TcpCommonExceptionFilter())
@Injectable()
export class CompaniesService {
  constructor(
    private readonly companyDbAccessService: CompanyDbAccessService,
  ) {
  }

  @AddressedErrorCatching()
  public async createCompany(data: ICreateCompanyReq): Promise<IResponse<ICreateCompanyRes>> {
    const createBrandResponse: { company: ICompany } = await this.companyDbAccessService.saveNewCompany({
      ...data,
      phoneConfirmed: false,
      emailConfirmed: false,
    });

    if (!createBrandResponse?.company) {
      throw new PreconditionFailedException('Some internal error happened while creating the company');
    }

    return {
      status: HttpStatus.CREATED,
      data: { company: createBrandResponse.company },
      errors: null,
    };
  }

 @AddressedErrorCatching()
  public async updateCompany(data: IUpdateCompanyReq): Promise<IResponse<IUpdateCompanyRes>> {

    const updateBrandResponse: { company: ICompany } = await this.companyDbAccessService.updateCompany(data);

    if (!updateBrandResponse?.company) {
      throw new PreconditionFailedException('Some internal error happened while updating the company');
    }

    return {
      status: HttpStatus.OK,
      data: { company: updateBrandResponse.company },
      errors: null,
    };
  }
}
