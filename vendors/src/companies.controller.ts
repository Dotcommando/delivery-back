import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { VENDORS_EVENTS } from './common/constants';
import { TcpCommonExceptionFilter } from './common/filters';
import { IResponse } from './common/types';
import { CreateCompanyBodyDto, UpdateCompanyBodyDto } from './dto';
import { CompaniesService } from './services';
import { ICreateCompanyRes, IUpdateCompanyRes } from './types';


@UseFilters(new TcpCommonExceptionFilter())
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {
  }

  @MessagePattern(VENDORS_EVENTS.VENDOR_CREATE_COMPANY)
  public async createCompany(data: CreateCompanyBodyDto): Promise<IResponse<ICreateCompanyRes>> {
    return await this.companiesService.createCompany(data);
  }

  @MessagePattern(VENDORS_EVENTS.VENDOR_UPDATE_COMPANY)
  public async updateCompany(data: UpdateCompanyBodyDto): Promise<IResponse<IUpdateCompanyRes>> {
    return await this.companiesService.updateCompany(data);
  }
}
