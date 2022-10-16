import { Types } from 'mongoose';

import { IVendor } from '../common/types';
import { UpdateVendorDto } from '../dto';


export interface IUpdateVendorData {
  body: UpdateVendorDto;
  _id: Types.ObjectId;
  avatar?: Express.Multer.File;
  user?: IVendor | null;
}
