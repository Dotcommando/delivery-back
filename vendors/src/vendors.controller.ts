import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { VENDORS_EVENTS } from './common/constants';
import { TcpCommonExceptionFilter } from './common/filters';
import { VendorsService } from './services';


@UseFilters(new TcpCommonExceptionFilter())
@Controller('vendors')
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @MessagePattern(VENDORS_EVENTS.VENDOR_CREATE_VENDOR)
  public async createVendor(): Promise<string> {
    return this.vendorsService.createVendor();
  }
}
