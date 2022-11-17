import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { IResponse } from '../common/types';
import { AuthService } from '../services';
import { IVerifyTokenRes } from '../types';


@Injectable()
export class JustMeGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  public async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    try {
      const req = context.switchToHttp().getRequest();
      const _id = req?.params?._id;
      const authHeader = req.headers['authorization'];
      const accessToken = authHeader.split(' ')[1];
      const verifyTokenResponse: IResponse<IVerifyTokenRes> = await this.authService.verifyAccessToken(accessToken);

      if (!verifyTokenResponse.data?.user) {
        return false;
      }

      if (verifyTokenResponse.data?.user?._id !== _id) {
        return false;
      }

      if (verifyTokenResponse.data?.user?.deactivated || verifyTokenResponse.data?.user?.suspended) {
        return false;
      }

      req.user = { ...verifyTokenResponse.data.user };

      return true;
    } catch (e) {
      return false;
    }
  }
}
