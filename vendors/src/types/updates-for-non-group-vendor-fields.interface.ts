import ObjectId from 'bson-objectid';

import { IVendor } from '../common/types';


export interface IUpdatesForNonGroupVendorFields<T_id = ObjectId, TAddress = ObjectId, TCompany = ObjectId, TBrand = ObjectId> {
  areFieldsToUpdate: boolean;
  areFieldsToRemove: boolean;
  valuesToSet: { [key in keyof Partial<IVendor<T_id, TAddress, TCompany, TBrand>>]: IVendor<T_id, TAddress, TCompany, TBrand>[keyof IVendor<T_id, TAddress, TCompany, TBrand>] };
  valuesToUnset: { [key in keyof Partial<IVendor<T_id, TAddress, TCompany, TBrand>>]: '' | null };
}
