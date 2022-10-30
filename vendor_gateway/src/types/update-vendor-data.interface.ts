import { Types } from 'mongoose';

import { IVendor } from '../common/types';
import { UpdateVendorBodyDto } from '../dto';


export interface IUpdateVendorData {
  body: UpdateVendorBodyDto;
  _id: Types.ObjectId;
  avatar?: Express.Multer.File | string;
  user?: IVendor | null;
}
