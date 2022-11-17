import { Types } from 'mongoose';

import { AnyId } from '../../types';


export function anyIdToMongoId(id: AnyId): Types.ObjectId {
  return new Types.ObjectId(String(id));
}
