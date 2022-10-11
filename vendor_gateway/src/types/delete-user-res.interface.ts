import { IVendor } from '../common/types';


export interface IDeleteUserRes {
  user: Pick<IVendor, 'firstName' | 'middleName' | 'lastName'>;
}
