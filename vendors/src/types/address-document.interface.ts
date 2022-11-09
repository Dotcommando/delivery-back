import ObjectId from 'bson-objectid';
import { Document } from 'mongoose';

import { IAddress } from '../common/types';


export interface IAddressDocument<T_id = ObjectId, TUser = ObjectId> extends Omit<IAddress<T_id, TUser>, '_id'>, Document {
  _id: | ObjectId | Document['_id'];
}
