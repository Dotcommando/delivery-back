import ObjectId from 'bson-objectid';
import { Document, Types } from 'mongoose';

import { IBrandMultilingualFieldSet } from '../common/types';


export interface IBrandMultilingualFieldSetDoc<T_id = Types.ObjectId> extends Omit<IBrandMultilingualFieldSet, '_id'>, Document<T_id> {
  _id: | Document['_id'] | ObjectId;
}
