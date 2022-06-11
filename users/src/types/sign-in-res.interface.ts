import { IUserSafe } from '../common/interfaces';

export interface ISignInRes {
  user: IUserSafe;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiredAfter: number;
  refreshTokenExpiredAfter: number;
}
