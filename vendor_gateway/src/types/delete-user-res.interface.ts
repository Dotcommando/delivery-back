import { IUser } from '../common/types';


export interface IDeleteUserRes {
  user: Pick<IUser, 'firstName' | 'middleName' | 'lastName' | 'username'>;
}
