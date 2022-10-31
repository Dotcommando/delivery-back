import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { VENDORS_EVENTS } from './common/constants';
import { TcpCommonExceptionFilter } from './common/filters';
import { IResponse } from './common/types';
import { BrandsService } from './services';
import { ICreateBrandRes } from './types';


@UseFilters(new TcpCommonExceptionFilter())
@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {
  }

  @MessagePattern(VENDORS_EVENTS.VENDOR_CREATE_BRAND)
  public async createBrand(data): Promise<IResponse<ICreateBrandRes>> {
    return await this.brandsService.createBrand(data);
  }
}
