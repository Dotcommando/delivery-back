import ObjectId from 'bson-objectid';

import { IBrand } from '../common/types';


export interface ISaveBrandImagesReq<T_id = ObjectId, TCompany = ObjectId> {
  files: { [fieldName: string]: [Express.Multer.File] };
  brand: IBrand<T_id, TCompany>;
}
