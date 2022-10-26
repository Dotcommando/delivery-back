import { Document, Types } from 'mongoose';

import { IBasicUserData } from './basic-user-data.interface';

import { ROLE, VENDOR_ROLE } from '../constants';

export interface IMembership<TGroup = Types.ObjectId> {
  role: VENDOR_ROLE;
  group: TGroup;
}

export interface IVendor<TAddress = Types.ObjectId, TCompany = Types.ObjectId> extends IBasicUserData {
  _id: Types.ObjectId;
  avatar: string;
  role: ROLE;
  addresses: TAddress[];
  companies: IMembership<TCompany>[];
  brands: IMembership<TCompany>[];
  emailConfirmed: boolean;
  phoneConfirmed: boolean;
  deactivated: boolean;
  suspended: boolean;
}

export interface IVendorDocument extends Omit<IVendor, '_id'>, Document<IVendor> {
  password: string;
  compareEncryptedPassword: (password: string) => boolean;
  getEncryptedPassword: (password: string) => string;
}
