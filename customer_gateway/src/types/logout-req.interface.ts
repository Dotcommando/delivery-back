import { IUser } from '../common/types';


export interface ILogoutReq {
  user: IUser;
  accessToken: string;
  refreshToken: string;
}
