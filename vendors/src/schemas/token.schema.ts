import { createHash } from 'crypto';
import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

import { BEARER_PREFIX, JWT_SECRET_KEY } from '../common/constants';
import { ITokenDocument } from '../types';


function prepareValue(doc, ret: { [key: string]: unknown }) {
  delete ret.id;
}

export const TokenSchema = new Schema<ITokenDocument, mongoose.Model<ITokenDocument>>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [ true, 'UserId required for refresh token' ],
    },
    accessToken: {
      type: String,
      required: false,
    },
    refreshToken: {
      type: String,
      index: true,
      required: [ true, 'Token hash is required' ],
    },
    issuedForUserAgent: {
      type: Schema.Types.ObjectId,
      ref: 'UserAgent',
      required: [ true, 'User Agent Id required' ],
    },
    issuedAt: {
      type: Schema.Types.Date,
      required: [ true, 'Date of issuing required' ],
    },
    expiredAfter: {
      type: Schema.Types.Date,
      required: [ true, 'Date of expiration required' ],
    },
    blacklisted: {
      type: Schema.Types.Boolean,
      default: false,
    },
  },
  {
    toObject: {
      virtuals: true,
      versionKey: false,
      transform: prepareValue,
    },
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: prepareValue,
    },
  },
);

TokenSchema.methods = {
  compareEncryptedRefreshToken(refreshToken: string) {
    return createHash('sha256')
      .update(`${JWT_SECRET_KEY}:${refreshToken.replace(BEARER_PREFIX, '')}`)
      .digest('hex') === this.refreshToken;
  },

  async getEncryptedToken(refreshToken: string) {
    return createHash('sha256')
      .update(`${JWT_SECRET_KEY}:${refreshToken.replace(BEARER_PREFIX, '')}`)
      .digest('hex') ;
  },
};

TokenSchema.pre<ITokenDocument>('save', async function(next) {
  const self = this as ITokenDocument;

  if (!this.isModified('refreshToken')) {
    return next();
  }

  self.refreshToken = await self.getEncryptedToken(self.refreshToken);
  next();
});

TokenSchema.pre<ITokenDocument>('updateOne', async function(next) {
  try {
    if (this?.['_update']?.refreshToken) {
      // @ts-ignore
      const docToUpdate = await this.model.findOne(this.getQuery());
      this['_update'].refreshToken = await docToUpdate.getEncryptedToken(this['_update'].refreshToken);
    }

    next(null);
  } catch (e) {
    next(e);
  }
});

export const TokenModel = mongoose.model<ITokenDocument, mongoose.Model<ITokenDocument>>('Token', TokenSchema);
