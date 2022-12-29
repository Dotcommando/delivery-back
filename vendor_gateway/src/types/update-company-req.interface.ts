import ObjectId from 'bson-objectid';

import { IVendor } from '../common/types';
import { UpdateCompanyBodyDto } from '../dto';


export interface IUpdateCompanyData {
  body: UpdateCompanyBodyDto;
  _id: ObjectId;
  user?: IVendor | null;
}
