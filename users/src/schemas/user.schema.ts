import * as bcrypt from 'bcrypt';
import * as mongoose from 'mongoose';

import { AddressSchema } from './address.schema';

import { EMAIL_REGEXP, ROLE, USERNAME_REGEXP } from '../common/constants';
import { IUserDocument } from '../common/interfaces';
import {
  IMAGE_BASE64_MAX_LENGTH,
  NAME_MAX_LENGTH,
  NAME_MIN_LENGTH,
  PASSWORD_MIN_LENGTH,
  PROPERTY_LENGTH_64,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
} from '../constants';
import { optionalRange } from '../validators';


function transformValue(doc, ret: { [key: string]: unknown }) {
  delete ret.password;
}

const SALT_ROUNDS = 10;
const Schema = mongoose.Schema;

export const UserSchema = new Schema<IUserDocument, mongoose.Model<IUserDocument>>(
  {
    userName: {
      type: String,
      validate: optionalRange(USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH),
      match: [
        USERNAME_REGEXP,
        'Username should includes English letters, digits and dots only',
      ],
      index: {
        unique: true,
        partialFilterExpression: {
          'userName': { $exists: true },
        },
      },
    },
    firstName: {
      type: String,
      required: [ true, 'First name is required' ],
      minLength: NAME_MIN_LENGTH,
      maxLength: NAME_MAX_LENGTH,
    },
    middleName: {
      type: String,
      validate: optionalRange(NAME_MIN_LENGTH, NAME_MAX_LENGTH),
    },
    lastName: {
      type: String,
      required: [ true, 'Last name is required' ],
      minLength: NAME_MIN_LENGTH,
      maxLength: NAME_MAX_LENGTH,
    },
    email: {
      type: String,
      required: [ true, 'Email can not be empty' ],
      index: { unique: true },
      lowercase: true,
      match: [
        EMAIL_REGEXP,
        'Email should be valid',
      ],
      validate: optionalRange(0, PROPERTY_LENGTH_64),
    },
    avatar: {
      type: String,
      validate: optionalRange(0, IMAGE_BASE64_MAX_LENGTH),
    },
    addresses: [AddressSchema],
    phoneNumbers: [String],
    roles: {
      type: [String],
      required: [ true, 'User must have at least one role' ],
      default: [ROLE.GUEST],
      enum: [
        ROLE.GUEST,
        ROLE.USER,
        ROLE.DELIVERYMAN,
        ROLE.OPERATOR,
        ROLE.MANAGER,
        ROLE.ADMIN,
      ],
    },
    orders: {
      type: [Schema.Types.ObjectId],
    },
    isConfirmed: {
      type: Schema.Types.Boolean,
      required: [ true, 'Confirmed field can not be empty' ],
    },
    password: {
      type: String,
      required: [ true, 'Password can not be empty' ],
      minlength: [ PASSWORD_MIN_LENGTH, 'Password should include at least 6 symbols' ],
    },
    deactivated: {
      type: Schema.Types.Boolean,
      default: false,
    },
  },
  {
    toObject: {
      virtuals: true,
      versionKey: false,
      transform: transformValue,
    },
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: transformValue,
    },
  },
);

UserSchema.methods = {
  getEncryptedPassword(password: string) {
    return bcrypt.hash(String(password), SALT_ROUNDS);
  },

  async compareEncryptedPassword(password: string) {
    // @ts-ignore
    return await bcrypt.compare(password, this.password);
  },
};

UserSchema.pre<IUserDocument>('save', async function(next) {
  const self = this as IUserDocument;

  self.email = self.email.toLowerCase();

  if (!this.isModified('password')) {
    return next();
  }
  // @ts-ignore
  self.password = await self.getEncryptedPassword(self.password);
  next();
});

UserSchema.pre<IUserDocument>('updateOne', async function(next) {
  try {
    if (this?.['_update']?.password) {
      // @ts-ignore
      const docToUpdate = await this.model.findOne(this.getQuery());
      this['_update'].password = await docToUpdate.getEncryptedPassword(this['_update'].password);
    }

    if (this?.['_update']?.email) {
      this['_update'].email = this['_update'].email.toLowerCase();
    }

    next(null);
  } catch (e) {
    next(e);
  }
});

export const UserModel = mongoose.model<IUserDocument, mongoose.Model<IUserDocument>>('User', UserSchema);
