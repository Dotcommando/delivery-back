import ObjectId from 'bson-objectid';

import { IBrandMultilingualFieldSet } from './brand-multilingual-field-set.interface';


export interface IBrand<T_id = ObjectId, TCompany = ObjectId> {
  _id: T_id;
  company: TCompany;
  logoLight?: string;
  logoDark?: string;
  backgroundLight?: string;
  backgroundDark?: string;
  translations: IBrandMultilingualFieldSet[];
}
