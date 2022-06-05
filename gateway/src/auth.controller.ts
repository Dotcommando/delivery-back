import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';

import { Observable } from 'rxjs';

import { USERS_EVENTS } from './common/constants';


@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
  ) {
  }

  @Post('register')
  public register(
    @Body() body,
  ): Observable<unknown> {
    return this.userServiceClient.send(USERS_EVENTS.USER_CREATE_USER, {
      ...body,
    });
  }
}
