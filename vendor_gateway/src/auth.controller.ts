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

import { IResponse, IVendor } from './common/types';
import { Logout, Register, ReissueTokens, SignIn } from './decorators';
import { LogoutBodyDto, ReissueTokensBodyDto, VendorRegisterBodyDto, VendorSignInBodyDto } from './dto';
import { AuthLocalGuard, JwtGuard } from './guards';
import { AuthService } from './services';
import { AuthenticatedRequest, AuthorizedRequest, ILogoutRes, IVendorSignInRes } from './types';


@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    @Inject('VENDOR_SERVICE') private readonly vendorServiceClient: ClientProxy,
  ) {
  }

  @Register()
  @Post('vendor-register')
  public async vendorRegister(
    @Body() body: VendorRegisterBodyDto,
  ): Promise<IResponse<IVendorSignInRes>> {
    return await this.authService.vendorRegister(body);
  }

  @SignIn()
  @UseGuards(AuthLocalGuard)
  @Post('vendor-sign-in')
  public async vendorSignIn(
    @Body() body: VendorSignInBodyDto,
    @Req() req: AuthorizedRequest,
  ): Promise<IResponse<IVendorSignInRes>> {
    const data: IVendorSignInRes | null = req?.user ?? null;

    if (!data) {
      throw new UnauthorizedException('User with such pare of email or username and password not found');
    }

    return {
      status: HttpStatus.OK,
      data,
      errors: null,
    };
  }

  @ReissueTokens()
  @UseGuards(JwtGuard)
  @Post('vendor-reissue-tokens')
  public async vendorReissueTokens(
    @Body() body: ReissueTokensBodyDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<IResponse<IVendorSignInRes>> {
    const user: IVendor | null = req?.user ?? null;
    const accessToken = body.accessToken;
    const refreshToken: string | null = req.headers?.authorization;

    return await this.authService.vendorReissueTokens({ user, accessToken, refreshToken });
  }

  @Logout()
  @UseGuards(JwtGuard)
  @Post('vendor-logout')
  public async vendorLogout(
    @Body() body: LogoutBodyDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<IResponse<ILogoutRes>> {
    const user: IVendor | null = req?.user ?? null;
    const accessToken: string = req.headers?.authorization;
    const refreshToken: string = body.refreshToken;

    return await this.authService.vendorLogout({ user, accessToken, refreshToken });
  }
}
