import { IUser } from '../common/types';


export interface ILogoutRes {
  user: Pick<IUser, 'firstName' | 'middleName' | 'lastName' | 'username'>;
}
