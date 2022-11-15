import ObjectId from 'bson-objectid';
import { Types } from 'mongoose';


export type AnyId = string | Types.ObjectId | ObjectId;
