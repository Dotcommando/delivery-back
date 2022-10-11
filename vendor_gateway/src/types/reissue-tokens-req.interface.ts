import { IVendor } from '../common/types';

export interface IReissueTokensReq {
  user: IVendor;
  accessToken: string;
  refreshToken: string;
}
