import { IVendor } from '../common/types';

export interface IVendorSignInRes {
  user: IVendor;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiredAfter: number;
  refreshTokenExpiredAfter: number;
}
