import { Document, Types } from 'mongoose';

import { ROLE } from '../constants';


export interface IUser {
  _id: Types.ObjectId;
  firstName: string;
  middleName?: string;
  lastName: string;
  username?: string;
  email: string;
  avatar: string;
  addresses: Types.ObjectId[];
  phoneNumbers: string[];
  roles: ROLE[];
  orders: Types.ObjectId[];
  isConfirmed: boolean;
  deactivated: boolean;
}

export interface IUserDocument extends Omit<IUser, '_id'>, Document<IUser> {
  password: string;
  compareEncryptedPassword: (password: string) => boolean;
  getEncryptedPassword: (password: string) => string;
}