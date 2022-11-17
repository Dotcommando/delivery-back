import { IVendor } from '../common/types';


export interface ILogoutReq {
  user: IVendor;
  accessToken: string;
  refreshToken: string;
}
