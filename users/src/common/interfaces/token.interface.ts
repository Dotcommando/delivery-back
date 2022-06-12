import { Document, Types } from 'mongoose';

export interface IToken {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  accessToken?: string;
  refreshToken: string;
  issuedForUserAgent: Types.ObjectId;
  issuedAt: Date;
  expiredAfter: Date;
  blacklisted: boolean;
}

export interface ITokenDocument extends Omit<IToken, '_id'>, Document<IToken> {
  compareEncryptedRefreshToken: (refreshToken: string) => boolean;
  getEncryptedToken: (refreshToken: string) => string;
}
