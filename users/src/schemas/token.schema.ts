import * as bcrypt from 'bcrypt';
import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

import { ITokenDocument } from '../common/interfaces';


function prepareValue(doc, ret: { [key: string]: unknown }) {
  delete ret.id;
}

const SALT_ROUNDS = 10;

export const TokenSchema = new Schema<ITokenDocument, mongoose.Model<ITokenDocument>>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [ true, 'UserId required for refresh token' ],
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
    return bcrypt.compare(refreshToken, this.refreshToken);
  },

  async getEncryptedToken(refreshToken: string) {
    return bcrypt.hash(String(refreshToken), SALT_ROUNDS);
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
