import { Controller, Get, Inject, Param, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';

import { lastValueFrom, timeout } from 'rxjs';

import { MAX_TIME_OF_REQUEST_WAITING, USERS_EVENTS } from './common/constants';
import { GetUserParamDto } from './dto';
import { JwtGuard } from './guards';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(
    private readonly configService: ConfigService,
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
  ) {
  }

  @UseGuards(JwtGuard)
  @Get('one/:_id')
  public async getUser(
    @Param() param: GetUserParamDto,
  ) {
    return await lastValueFrom(
      this.userServiceClient
        .send(USERS_EVENTS.USER_GET_USER, { _id: param._id })
        .pipe(timeout(MAX_TIME_OF_REQUEST_WAITING)),
    );
  }
}
