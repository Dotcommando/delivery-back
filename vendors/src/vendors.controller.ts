import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import ObjectId from 'bson-objectid';

import { VENDORS_EVENTS } from './common/constants';
import { TcpCommonExceptionFilter } from './common/filters';
import { IAddress, IResponse, IVendor } from './common/types';
import {
  DeleteVendorBodyDto,
  LogoutBodyDto,
  ReadVendorBodyDto,
  RegisterVendorBodyDto,
  ReissueTokensBodyDto,
  UpdateVendorBodyDto,
  VendorSignInBodyDto,
  VerifyAccessTokenBodyDto,
} from './dto';
import { VendorsService } from './services';
import {
  IIssueTokensRes,
  ILogoutRes,
  IVendorSignInRes,
  IVerifyTokenRes,
} from './types';


@UseFilters(new TcpCommonExceptionFilter())
@Controller('vendors')
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {
  }

  @MessagePattern(VENDORS_EVENTS.VENDOR_CREATE_VENDOR)
  public async vendorRegister(user: RegisterVendorBodyDto): Promise<IResponse<{ user: IVendor }>> {
    return await this.vendorsService.vendorRegister(user);
  }

  @MessagePattern(VENDORS_EVENTS.VENDOR_ISSUE_TOKENS)
  public async vendorSignIn(user: VendorSignInBodyDto): Promise<IResponse<IVendorSignInRes>> {
    return await this.vendorsService.vendorSignIn(user);
  }

  @MessagePattern(VENDORS_EVENTS.VENDOR_VERIFY_ACCESS_TOKEN)
  public async verifyAccessToken(data: VerifyAccessTokenBodyDto): Promise<IResponse<IVerifyTokenRes>> {
    return await this.vendorsService.verifyAccessToken(data);
  }

  @MessagePattern(VENDORS_EVENTS.VENDOR_REISSUE_TOKENS)
  public async reissueTokens(data: ReissueTokensBodyDto): Promise<IResponse<IIssueTokensRes>> {
    return await this.vendorsService.reissueTokens(data);
  }

  @MessagePattern(VENDORS_EVENTS.VENDOR_LOGOUT_VENDOR)
  public async logout(data: LogoutBodyDto): Promise<IResponse<null>> {
    return await this.vendorsService.logout(data);
  }

  @MessagePattern(VENDORS_EVENTS.VENDOR_READ_VENDOR)
  public async readVendor(user: ReadVendorBodyDto): Promise<IResponse<{ user: IVendor<ObjectId, IAddress> }>> {
    return await this.vendorsService.readVendor(user);
  }

  @MessagePattern(VENDORS_EVENTS.VENDOR_UPDATE_VENDOR)
  public async updateVendor(data: UpdateVendorBodyDto): Promise<IResponse<{ user: IVendor<ObjectId, IAddress> }>> {
    return await this.vendorsService.updateVendor(data);
  }

  @MessagePattern(VENDORS_EVENTS.VENDOR_DELETE_USER)
  public async deleteVendor(data: DeleteVendorBodyDto): Promise<IResponse<ILogoutRes>> {
    return await this.vendorsService.deleteVendor(data);
  }
}
