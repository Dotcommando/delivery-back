import { Body, Controller, Inject, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';

import { lastValueFrom, timeout } from 'rxjs';

import { MAX_TIME_OF_REQUEST_WAITING, USERS_EVENTS } from './common/constants';
import { IResponse, IUserSafe } from './common/interfaces';
import { RegisterDto, SignInDto } from './dto';
import { AuthLocalGuard } from './guards';
import { AuthService } from './services';
import { AuthorizedRequest, ISignInRes } from './types';


@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
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

  @UseGuards(AuthLocalGuard)
  @Post('sign-in')
  public async signIn(
    @Body() body: SignInDto,
    @Req() req: AuthorizedRequest,
  ): Promise<IResponse<ISignInRes>> {
    // const user: IUserSafe | null = req?.user ?? null;
    //
    // if (!user) {
    //   throw new UnauthorizedException('User with such pare of email or username and password not found');
    // }

    return await this.authService.signIn(body);
  }
}
