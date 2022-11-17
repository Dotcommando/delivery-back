import { Types } from 'mongoose';

import { IUser } from '../common/types';


export interface IDeleteUserData {
  _id: Types.ObjectId;
  user: IUser | null;
}
