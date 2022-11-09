import ObjectId from 'bson-objectid';

import { IVendor } from '../common/types';
import { UpdateVendorBodyDto } from '../dto';


export interface IUpdateVendorData {
  body: UpdateVendorBodyDto;
  _id: ObjectId;
  user?: IVendor | null;
}
