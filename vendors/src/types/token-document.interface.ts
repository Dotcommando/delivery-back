import { Document } from 'mongoose';

import { IToken } from '../common/types';


export interface ITokenDocument extends Omit<IToken, '_id'>, Document<IToken> {
  compareEncryptedRefreshToken: (refreshToken: string) => boolean;
  getEncryptedToken: (refreshToken: string) => string;
}
