import { Types } from 'mongoose';

import { IVendor } from '../common/types';


export interface IDeleteVendorData {
  _id: Types.ObjectId;
  user: IVendor | null;
}
