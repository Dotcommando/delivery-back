import { Body, Controller, Post, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';

import { IResponse } from './common/types';
import { CreateBrand } from './decorators';
import { CreateBrandBodyDto } from './dto';
import { BrandsService } from './services';
import { AuthenticatedRequest, ICreateBrandRes } from './types';


@Controller('brands')
@ApiTags('brands')
export class BrandsController {
  constructor(
    private readonly configService: ConfigService,
    private readonly brandsService: BrandsService,
  ) {
  }

  @CreateBrand()
  @Post('/one')
  public async createBrand(
    @Body() body: CreateBrandBodyDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<IResponse<ICreateBrandRes>> {
    return await this.brandsService.createBrand(body);
  }
}
