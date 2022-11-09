import ObjectId from 'bson-objectid';

import { IVendor } from '../common/types';


export interface IDeleteVendorData {
  _id: ObjectId;
  user: IVendor | null;
}
