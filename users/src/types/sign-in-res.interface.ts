import { IUser } from '../common/interfaces';

export interface ISignInRes {
  user: IUser;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiredAfter: number;
  refreshTokenExpiredAfter: number;
}
