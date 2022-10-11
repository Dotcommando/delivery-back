import { Types } from 'mongoose';

import { IVendor } from '../common/types';
import { UpdateVendorBodyDto } from '../dto';


export interface IUpdateUserData {
  body: UpdateVendorBodyDto;
  _id: Types.ObjectId;
  user?: IVendor | null;
}
