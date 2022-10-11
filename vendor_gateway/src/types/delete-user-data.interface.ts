import { Types } from 'mongoose';

import { IVendor } from '../common/types';


export interface IDeleteUserData {
  _id: Types.ObjectId;
  user: IVendor | null;
}
