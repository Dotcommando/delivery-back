import { Body, Controller, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import ObjectId from 'bson-objectid';

import { VENDOR_ROLE } from './common/constants';
import { IResponse, IVendor } from './common/types';
import { CreateCompany, UpdateCompany } from './decorators';
import { CreateCompanyBodyDto, UpdateCompanyDto, UpdateCompanyParamDto } from './dto';
import { JwtGuard } from './guards';
import { CommonService, CompaniesService, VendorsService } from './services';
import {
  AuthenticatedRequest,
  ICreateCompanyReq,
  ICreateCompanyRes,
  IUpdateCompanyRes,
  IUpdateVendorData,
  IUpdateVendorRes,
} from './types';


@Controller('companies')
@ApiTags('companies')
export class CompaniesController {
  constructor(
    private readonly commonService: CommonService,
    private readonly companiesService: CompaniesService,
    private readonly vendorsService: VendorsService,
  ) {
  }

  @CreateCompany()
  @UseGuards(JwtGuard)
  @Post('/one')
  public async createCompany(
    @Body() body: CreateCompanyBodyDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<IResponse<| ICreateCompanyRes | IUpdateVendorRes>> {
    const _id = new ObjectId();
    const user: IVendor = req?.user;
    const company = { ...body.company, _id, managers: [user._id]};
    const updateBody = {
      body: { companies: { add: [{ role: body?.role ?? VENDOR_ROLE.OWNER, group: _id }]}},
      _id: user._id,
      user,
    };

    return await this.commonService
      .parallelCombineRequests<ICreateCompanyReq, ICreateCompanyRes, IUpdateVendorData, IUpdateVendorRes>([
        { fn: this.companiesService.createCompany, args: company },
        { fn: this.vendorsService.updateVendor, args: updateBody },
      ]);
  }

  @UpdateCompany()
  @UseGuards(JwtGuard)
  @Patch('/one/:_id')
  public async updateCompany(
    @Param() param: UpdateCompanyParamDto,
    @Body() company: UpdateCompanyDto,
  ): Promise<IResponse<| IUpdateCompanyRes | IUpdateVendorRes>> {
    return await this.companiesService.updateCompany({
      _id: param._id,
      company,
    });

  }

}
