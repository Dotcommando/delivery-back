import ObjectId from 'bson-objectid';

import { UpdateCompanyDto } from '../dto';


export interface IUpdateCompanyReq {
  company: UpdateCompanyDto;
  _id: ObjectId;
}
