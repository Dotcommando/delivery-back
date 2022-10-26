import { Document, Types } from 'mongoose';

import { IBasicUserData } from './basic-user-data.interface';

import { ROLE } from '../constants';


export interface IUser<TAddress = Types.ObjectId, TOrder = Types.ObjectId> extends IBasicUserData {
  _id: Types.ObjectId;
  username?: string;
  avatar: string;
  addresses: TAddress[];
  role: ROLE;
  orders: TOrder[];
  emailConfirmed: boolean;
  phoneConfirmed: boolean;
  deactivated: boolean;
}

export interface IUserDocument extends Omit<IUser, '_id'>, Document<IUser> {
  password: string;
  compareEncryptedPassword: (password: string) => boolean;
  getEncryptedPassword: (password: string) => string;
}
