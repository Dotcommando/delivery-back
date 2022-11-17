import { IVendor } from '../common/types';

export interface IValidateVendorRes {
  userIsValid: boolean;
  user?: IVendor;
}
