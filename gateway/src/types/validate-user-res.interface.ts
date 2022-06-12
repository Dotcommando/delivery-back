import { IUser } from '../common/types';

export interface IValidateUserRes {
  userIsValid: boolean;
  user?: IUser;
}
