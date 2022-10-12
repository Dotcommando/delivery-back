import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { VENDORS_EVENTS } from './common/constants';
import { TcpCommonExceptionFilter } from './common/filters';
import { IResponse, IVendor } from './common/types';
import { RegisterVendorBodyDto, ReissueTokensBodyDto, VendorSignInBodyDto, VerifyAccessTokenBodyDto } from './dto';
import { VendorsService } from './services';
import { IIssueTokensRes, IVendorSignInRes, IVerifyTokenRes } from './types';


@UseFilters(new TcpCommonExceptionFilter())
@Controller('vendors')
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

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
}
