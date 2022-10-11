import { IVendor } from '../common/types';


export interface ILogoutRes {
  user: Pick<IVendor, 'firstName' | 'middleName' | 'lastName'>;
}
