import { IUser } from '../common/interfaces';

export interface IValidateUserRes {
  userIsValid: boolean;
  user?: IUser;
}
