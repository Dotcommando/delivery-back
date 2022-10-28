import { Body, Controller, Inject, Post, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';

import { BrandsService } from './services';
import { AuthenticatedRequest } from './types';


@Controller('brands')
@ApiTags('brands')
export class BrandsController {
  constructor(
    private readonly configService: ConfigService,
    private readonly brandsService: BrandsService,
  ) {
  }

  @Post('/one')
  public async createBrand(
    @Body() body,
    @Req() req: AuthenticatedRequest,
  ) {
    return await this.brandsService.createBrand(body);
  }
}
