import { Document, Types } from 'mongoose';

import { ROLE } from '../constants';


export interface IUser<TAddress = Types.ObjectId, TOrder = Types.ObjectId> {
  _id: Types.ObjectId;
  firstName: string;
  middleName?: string;
  lastName: string;
  username?: string;
  email: string;
  avatar: string;
  addresses: TAddress[];
  phoneNumber: string;
  roles: ROLE[];
  orders: TOrder[];
  emailConfirmed: boolean;
  phoneConfirmed: boolean;
  deactivated: boolean;
}

export interface IUserDocument<TAddress = Types.ObjectId, TOrder = Types.ObjectId> extends Omit<IUser<TAddress, TOrder>, '_id'>, Document<IUser> {
  password: string;
  compareEncryptedPassword: (password: string) => boolean;
  getEncryptedPassword: (password: string) => string;
}
