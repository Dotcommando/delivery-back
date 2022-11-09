import ObjectId from 'bson-objectid';

import { IBasicUserData } from './basic-user-data.interface';

import { ROLE, VENDOR_ROLE } from '../constants';


export interface IMembership<TGroup = ObjectId> {
  role: VENDOR_ROLE;
  group: TGroup;
}

export interface IVendor<T_id = ObjectId, TAddress = ObjectId, TCompany = ObjectId, TBrand = ObjectId> extends IBasicUserData {
  _id: T_id;
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
