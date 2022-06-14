import {
  Body,
  Controller,
  HttpStatus,
  Inject,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';

import { IResponse, IUser } from './common/types';
import { LogoutBodyDto, RegisterBodyDto, ReissueTokensBodyDto, SignInBodyDto } from './dto';
import { AuthLocalGuard, JwtGuard } from './guards';
import { AuthService } from './services';
import { AuthenticatedRequest, AuthorizedRequest, ISignInRes } from './types';


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
    @Body() body: RegisterBodyDto,
  ): Promise<IResponse<ISignInRes>> {
    return await this.authService.register(body);
  }

  @UseGuards(AuthLocalGuard)
  @Post('sign-in')
  public async signIn(
    @Body() body: SignInBodyDto,
    @Req() req: AuthorizedRequest,
  ): Promise<IResponse<ISignInRes>> {
    const data: ISignInRes | null = req?.user ?? null;

    if (!data) {
      throw new UnauthorizedException('User with such pare of email or username and password not found');
    }

    return {
      status: HttpStatus.OK,
      data,
      errors: null,
    };
  }

  @UseGuards(JwtGuard)
  @Post('reissue-tokens')
  public async reissueTokens(
    @Body() body: ReissueTokensBodyDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<IResponse<ISignInRes>> {
    const user: IUser | null = req?.user ?? null;
    const accessToken = body.accessToken;
    const refreshToken: string | null = req.headers?.authorization;

    return await this.authService.reissueTokens({ user, accessToken, refreshToken });
  }

  @UseGuards(JwtGuard)
  @Post('logout')
  public async logout(
    @Body() body: LogoutBodyDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const user: IUser | null = req?.user ?? null;
    const accessToken: string = req.headers?.authorization;
    const refreshToken: string = body.refreshToken;

    return await this.authService.logout({ user, accessToken, refreshToken });
  }
}
