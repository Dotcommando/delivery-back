import { Document, ObjectId } from 'mongoose';

import { ROLE } from '../constants';


export interface IUser {
  _id: ObjectId;
  firstName: string;
  middleName?: string;
  lastName: string;
  username?: string;
  email: string;
  avatar: string;
  addresses: ObjectId[];
  phoneNumbers: string[];
  roles: ROLE[];
  orders: ObjectId[];
  isConfirmed: boolean;
  password: string;
  deactivated: boolean;
}

export interface IUserDocument extends Omit<IUser, '_id'>, Document<IUser> {
  compareEncryptedPassword: (password: string) => boolean;
  getEncryptedPassword: (password: string) => string;
}

export type IUserSafe = Omit<IUser, 'password'>;
