import { IUser } from '../common/interfaces';

export interface IVerifyTokenRes {
  verified: boolean;
  user?: IUser;
}
