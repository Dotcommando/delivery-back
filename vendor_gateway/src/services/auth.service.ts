import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { lastValueFrom, map, timeout } from 'rxjs';

import { MAX_TIME_OF_REQUEST_WAITING, VENDORS_EVENTS } from '../common/constants';
import { AddressedErrorCatching, ApplyAddressedErrorCatching } from '../common/decorators';
import { IResponse, IVendor } from '../common/types';
import { VendorRegisterBodyDto, VendorSignInBodyDto } from '../dto';
import {
  IIssueTokensRes,
  ILogoutReq,
  ILogoutRes,
  IReissueTokensReq,
  IVendorSignInRes,
  IVerifyTokenRes,
} from '../types';


@ApplyAddressedErrorCatching
@Injectable()
export class AuthService {
  constructor(
    @Inject('VENDOR_SERVICE') private readonly vendorServiceClient: ClientProxy,
  ) {
  }

  public async vendorSignIn(user: VendorSignInBodyDto): Promise<IResponse<IVendorSignInRes>> {
    return await lastValueFrom(
      this.vendorServiceClient
        .send(VENDORS_EVENTS.VENDOR_ISSUE_TOKENS, user)
        .pipe(timeout(MAX_TIME_OF_REQUEST_WAITING)),
    );
  }

  @AddressedErrorCatching()
  public async vendorRegister(user: VendorRegisterBodyDto): Promise<IResponse<IVendorSignInRes>> {
    const registerResponse: IResponse<{ user: IVendor }> = await lastValueFrom(
      this.vendorServiceClient
        .send(VENDORS_EVENTS.VENDOR_CREATE_VENDOR, user)
        .pipe(timeout(MAX_TIME_OF_REQUEST_WAITING)),
    );

    if (registerResponse.status !== HttpStatus.CREATED) {
      return registerResponse as IResponse<IVendorSignInRes>;
    }

    return await this.vendorSignIn({ email: user.email, password: user.password });
  }

  public async verifyAccessToken(accessToken: string): Promise<IResponse<IVerifyTokenRes>> {
    return await lastValueFrom(
      this.vendorServiceClient
        .send(VENDORS_EVENTS.VENDOR_VERIFY_ACCESS_TOKEN, { accessToken })
        .pipe(timeout(MAX_TIME_OF_REQUEST_WAITING)),
    );
  }

  public async vendorReissueTokens(request: IReissueTokensReq): Promise<IResponse<IVendorSignInRes>> {
    const { accessToken, refreshToken, user } = request;

    return await lastValueFrom(
      this.vendorServiceClient
        .send(VENDORS_EVENTS.VENDOR_REISSUE_TOKENS, {
          accessToken,
          refreshToken,
        })
        .pipe(
          map((response: IResponse<IIssueTokensRes>): IResponse<IVendorSignInRes> => response.status === HttpStatus.OK
            ? {
              ...response,
              data: {
                ...response.data,
                user,
              },
            }
            : response as IResponse<IVendorSignInRes>,
          ),
          timeout(MAX_TIME_OF_REQUEST_WAITING),
        ),
    );
  }

  public async vendorLogout(request: ILogoutReq): Promise<IResponse<ILogoutRes>> {
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
                },
              },
            }
            : response,
          ),
        ),
    );
  }
}
