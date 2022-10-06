import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { lastValueFrom, map, timeout } from 'rxjs';

import { MAX_TIME_OF_REQUEST_WAITING, VENDORS_EVENTS } from '../common/constants';
import { IResponse, IUser } from '../common/types';
import { RegisterBodyDto, SignInBodyDto } from '../dto';
import { IIssueTokensRes, ILogoutReq, ILogoutRes, IReissueTokensReq, ISignInRes, IVerifyTokenRes } from '../types';


@Injectable()
export class AuthService {
  constructor(
    @Inject('VENDOR_SERVICE') private readonly vendorServiceClient: ClientProxy,
  ) {
  }

  public async signIn(user: SignInBodyDto): Promise<IResponse<ISignInRes>> {
    return await lastValueFrom(
      this.vendorServiceClient
        .send(VENDORS_EVENTS.VENDOR_ISSUE_TOKENS, user)
        .pipe(timeout(MAX_TIME_OF_REQUEST_WAITING)),
    );
  }

  public async register(user: RegisterBodyDto): Promise<IResponse<ISignInRes>> {
    const registerResponse: IResponse<{ user: IUser }> = await lastValueFrom(
      this.vendorServiceClient
        .send(VENDORS_EVENTS.VENDOR_CREATE_USER, user)
        .pipe(timeout(MAX_TIME_OF_REQUEST_WAITING)),
    );

    if (registerResponse.status !== HttpStatus.CREATED) {
      return registerResponse as IResponse<ISignInRes>;
    }

    return await this.signIn({ email: user.email, password: user.password });
  }

  public async verifyAccessToken(accessToken: string): Promise<IResponse<IVerifyTokenRes>> {
    return await lastValueFrom(
      this.vendorServiceClient
        .send(VENDORS_EVENTS.VENDOR_VERIFY_ACCESS_TOKEN, { accessToken })
        .pipe(timeout(MAX_TIME_OF_REQUEST_WAITING)),
    );
  }

  public async reissueTokens(request: IReissueTokensReq): Promise<IResponse<ISignInRes>> {
    const { accessToken, refreshToken, user } = request;

    return await lastValueFrom(
      this.vendorServiceClient
        .send(VENDORS_EVENTS.VENDOR_REISSUE_TOKENS, {
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
      this.vendorServiceClient
        .send(VENDORS_EVENTS.VENDOR_LOGOUT_USER, { accessToken, refreshToken })
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
