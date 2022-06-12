import { IUser } from '../common/types';

export interface IVerifyTokenRes {
  verified: boolean;
  user?: IUser;
}
