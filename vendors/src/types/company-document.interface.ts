import ObjectId from 'bson-objectid';
import { Document, Types } from 'mongoose';

import { ICompany } from '../common/types';


export interface ICompanyDocument<T_id = Types.ObjectId, TAddress = Types.ObjectId, TManager = Types.ObjectId> extends Omit<ICompany<T_id, TAddress, TManager>, '_id'>, Document<T_id> {
  _id: | Document['_id'] | ObjectId;
}
