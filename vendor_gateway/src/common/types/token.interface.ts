import ObjectId from 'bson-objectid';

export interface IToken {
  _id: ObjectId;
  userId: ObjectId;
  accessToken?: string;
  refreshToken: string;
  issuedForUserAgent: ObjectId;
  issuedAt: Date;
  expiredAfter: Date;
  blacklisted: boolean;
}
