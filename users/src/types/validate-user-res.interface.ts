import { IUserSafe } from '../common/interfaces';

export interface IValidateUserRes {
  userIsValid: boolean;
  user?: IUserSafe;
}
