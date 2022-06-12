import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { IResponse } from '../common/types';
import { AuthService } from '../services';
import { IVerifyTokenRes } from '../types';


@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  public async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    try {
      const req = context.switchToHttp().getRequest();
      const authHeader = req.headers['authorization'];
      const accessToken = authHeader.split(' ')[1];
      const verifyTokenResponse: IResponse<IVerifyTokenRes> = await this.authService.verifyAccessToken(accessToken);

      if (!verifyTokenResponse.data?.user) {
        return false;
      }

      req.user = { ...verifyTokenResponse.data.user };

      return true;
    } catch (e) {
      return false;
    }
  }
}
