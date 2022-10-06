import { IUser } from '../common/types';

export interface IReissueTokensReq {
  user: IUser;
  accessToken: string;
  refreshToken: string;
}
