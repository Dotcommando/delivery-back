import ObjectId from 'bson-objectid';
import { Types } from 'mongoose';

import { IToken } from '../common/types';


export interface IRefreshTokenData extends Omit<IToken, '_id' | 'userId' | 'issuedForUserAgent'> {
  userId: string | Types.ObjectId | ObjectId;
  issuedForUserAgent: string | Types.ObjectId | ObjectId;
}
