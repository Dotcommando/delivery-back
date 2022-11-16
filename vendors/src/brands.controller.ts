import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { VENDORS_EVENTS } from './common/constants';
import { BrandDto } from './common/dto';
import { TcpCommonExceptionFilter } from './common/filters';
import { IResponse } from './common/types';
import { DeleteBrandBodyDto, ReadBrandBodyDto, UpdateBrandBodyDto } from './dto';
import { BrandsService } from './services';
import { ICreateBrandRes, IReadBrandRes, IUpdateBrandRes } from './types';


@UseFilters(new TcpCommonExceptionFilter())
@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {
  }

  @MessagePattern(VENDORS_EVENTS.VENDOR_CREATE_BRAND)
  public async createBrand(data: BrandDto): Promise<IResponse<ICreateBrandRes>> {
    return await this.brandsService.createBrand(data);
  }

  @MessagePattern(VENDORS_EVENTS.VENDOR_READ_BRAND)
  public async readBrand(data: ReadBrandBodyDto): Promise<IResponse<IReadBrandRes>> {
    return await this.brandsService.readBrand(data);
  }

  @MessagePattern(VENDORS_EVENTS.VENDOR_UPDATE_BRAND)
  public async updateBrand(data: UpdateBrandBodyDto): Promise<IResponse<IUpdateBrandRes>> {
    return await this.brandsService.updateBrand(data);
  }

  @MessagePattern(VENDORS_EVENTS.VENDOR_DELETE_BRAND)
  public async deleteBrand(data: DeleteBrandBodyDto): Promise<IResponse<null>> {
    return await this.brandsService.deleteBrand(data);
  }
}
