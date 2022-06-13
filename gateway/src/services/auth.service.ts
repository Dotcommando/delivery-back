import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { lastValueFrom, map, timeout } from 'rxjs';

import { MAX_TIME_OF_REQUEST_WAITING, USERS_EVENTS } from '../common/constants';
import { IResponse } from '../common/types';
import { SignInBodyDto } from '../dto';
import { IIssueTokensRes, ILogoutReq, ILogoutRes, IReissueTokensReq, ISignInRes, IVerifyTokenRes } from '../types';


@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
  ) {
  }

  public async signIn(user: SignInBodyDto): Promise<IResponse<ISignInRes>> {
    return await lastValueFrom(
      this.userServiceClient
        .send(USERS_EVENTS.USER_ISSUE_TOKENS, user)
        .pipe(timeout(MAX_TIME_OF_REQUEST_WAITING)),
    );
  }

  public async verifyAccessToken(accessToken: string): Promise<IResponse<IVerifyTokenRes>> {
    return await lastValueFrom(
      this.userServiceClient
        .send(USERS_EVENTS.USER_VERIFY_ACCESS_TOKEN, { accessToken })
        .pipe(timeout(MAX_TIME_OF_REQUEST_WAITING)),
    );
  }

  public async reissueTokens(request: IReissueTokensReq): Promise<IResponse<ISignInRes>> {
    const { accessToken, refreshToken, user } = request;

    return await lastValueFrom(
      this.userServiceClient
        .send(USERS_EVENTS.USER_REISSUE_TOKENS, {
          accessToken,
          refreshToken,
        })
        .pipe(
          map((response: IResponse<IIssueTokensRes>): IResponse<ISignInRes> => response.status === HttpStatus.OK
            ? {
              ...response,
              data: {
                ...response.data,
                user,
              },
            }
            : response as IResponse<ISignInRes>,
          ),
          timeout(MAX_TIME_OF_REQUEST_WAITING),
        ),
    );
  }

  public async logout(request: ILogoutReq): Promise<IResponse<ILogoutRes>> {
    const { user, accessToken, refreshToken } = request;

    return await lastValueFrom(
      this.userServiceClient
        .send(USERS_EVENTS.USER_LOGOUT, { accessToken, refreshToken })
        .pipe(
          timeout(MAX_TIME_OF_REQUEST_WAITING),
          map((response: IResponse<null>) => response.status === HttpStatus.OK
            ? {
              ...response,
              data: {
                user: {
                  firstName: user.firstName,
                  middleName: user.middleName,
                  lastName: user.lastName,
                  ...(user.username && { username: user.username }),
                },
              },
            }
            : response,
          ),
        ),
    );
  }
}
