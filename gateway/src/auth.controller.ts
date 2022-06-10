import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';

import { lastValueFrom, timeout } from 'rxjs';

import { MAX_TIME_OF_REQUEST_WAITING, USERS_EVENTS } from './common/constants';
import { IResponse, IUserSafe } from './common/interfaces';
import { RegisterDto } from './dto';


@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
  ) {
  }

  @Post('register')
  public async register(
    @Body() body: RegisterDto,
  ): Promise<IResponse<{ user: IUserSafe }>> {
    return await lastValueFrom(
      this.userServiceClient.send(USERS_EVENTS.USER_CREATE_USER, body)
        .pipe(timeout(MAX_TIME_OF_REQUEST_WAITING)),
    );
  }
}
