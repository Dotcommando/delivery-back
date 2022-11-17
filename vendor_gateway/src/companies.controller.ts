import { Body, Controller, Inject, Post, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';

import { AuthenticatedRequest } from './types';


@Controller('companies')
@ApiTags('companies')
export class CompaniesController {
  constructor(
    private readonly configService: ConfigService,
  ) {
  }

  @Post('/one')
  public async createCompany(
    @Body() body,
    @Req() req: AuthenticatedRequest,
  ) {

  }
}
