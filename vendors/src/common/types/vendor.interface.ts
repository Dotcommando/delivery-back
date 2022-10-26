import { Document, Types } from 'mongoose';

import { IBasicUserData } from './basic-user-data.interface';

import { ROLE, VENDOR_ROLE } from '../constants';

export interface IMembership<TGroup = Types.ObjectId> {
  role: VENDOR_ROLE;
  group: TGroup;
}

export interface IVendor<TAddress = Types.ObjectId, TCompany = Types.ObjectId, TBrand = Types.ObjectId> extends IBasicUserData {
  _id: Types.ObjectId;
  avatar: string;
  role: ROLE;
  addresses: TAddress[];
  companies: IMembership<TCompany>[];
  brands: IMembership<TBrand>[];
  emailConfirmed: boolean;
  phoneConfirmed: boolean;
  deactivated: boolean;
  suspended: boolean;
}

export interface IVendorDocument<TAddress = Types.ObjectId, TCompany = Types.ObjectId, TBrand = Types.ObjectId> extends Omit<IVendor<TAddress, TCompany, TBrand>, '_id'>, Document<IVendor> {
  password: string;
  compareEncryptedPassword: (password: string) => boolean;
  getEncryptedPassword: (password: string) => string;
}
