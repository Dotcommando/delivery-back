import { Document, Types } from 'mongoose';

import { IVendor } from '../common/types';


export interface IVendorDocument<T_id = Types.ObjectId, TAddress = Types.ObjectId, TCompany = Types.ObjectId, TBrand = Types.ObjectId> extends Omit<IVendor<T_id, TAddress, TCompany, TBrand>, '_id'>, Document<T_id> {
  password: string;
  compareEncryptedPassword: (password: string) => boolean;
  getEncryptedPassword: (password: string) => string;
}
