import { Document, Types } from 'mongoose';

import { ROLE, VENDOR_ROLE } from '../constants';

export interface IMembership<TGroup = Types.ObjectId> {
  role: VENDOR_ROLE;
  group: TGroup;
}

export interface IVendor<TAddress = Types.ObjectId, TCompany = Types.ObjectId> {
  _id: Types.ObjectId;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  avatar: string;
  role: ROLE;
  addresses: TAddress[];
  companies: IMembership<TCompany>[];
  brands: IMembership<TCompany>[];
  phoneNumber: string;
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
