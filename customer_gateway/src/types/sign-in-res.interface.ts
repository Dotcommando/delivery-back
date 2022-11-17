import { IUser } from '../common/types';

export interface ISignInRes {
  user: IUser;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiredAfter: number;
  refreshTokenExpiredAfter: number;
}
