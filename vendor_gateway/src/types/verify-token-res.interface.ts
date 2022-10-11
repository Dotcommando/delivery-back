import { IVendor } from '../common/types';

export interface IVerifyTokenRes {
  verified: boolean;
  user?: IVendor;
}
