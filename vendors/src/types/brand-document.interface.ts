import ObjectId from 'bson-objectid';
import { Document, Types } from 'mongoose';

import { IBrand, IBrandMultilingualFieldSet } from '../common/types';
import { IBrandMultilingualFieldSetDoc } from '../types';


export interface IBrandDocument<T_id = Types.ObjectId> extends Omit<IBrand, '_id' | 'translations'>, Document<T_id> {
  _id: | Document['_id'] | ObjectId;
  translations: (IBrandMultilingualFieldSetDoc | IBrandMultilingualFieldSet)[];
}
