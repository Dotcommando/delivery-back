import * as bcrypt from 'bcrypt';
import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

import { MembershipSchema } from './membership.schema';

import {
  EMAIL_REGEXP,
  IMAGE_BASE64_MAX_LENGTH,
  NAME_MAX_LENGTH,
  NAME_MIN_LENGTH,
  NAME_REGEXP,
  PASSWORD_MIN_LENGTH,
  PHONE_NUMBER_MAX_LENGTH,
  PHONE_NUMBER_MIN_LENGTH,
  PROPERTY_LENGTH_64,
  ROLE,
} from '../common/constants';
import { IVendorDocument } from '../common/types';
import { optionalRange } from '../validators';


function safeValue(doc, ret: { [key: string]: unknown }) {
  delete ret.password;
  delete ret.id;
}

const SALT_ROUNDS = 10;

export const VendorSchema = new Schema<IVendorDocument, mongoose.Model<IVendorDocument>>(
  {
    firstName: {
      type: String,
      required: [ true, 'First name is required' ],
      minLength: NAME_MIN_LENGTH,
      maxLength: NAME_MAX_LENGTH,
      match: [ NAME_REGEXP, 'First name can contain just latin symbols, digits, underscores and single quotes' ],
    },
    middleName: {
      type: String,
      validate: optionalRange(NAME_MIN_LENGTH, NAME_MAX_LENGTH),
      match: [ NAME_REGEXP, 'Middle name can contain just latin symbols, digits, underscores and single quotes' ],
    },
    lastName: {
      type: String,
      required: [ true, 'Last name is required' ],
      minLength: NAME_MIN_LENGTH,
      maxLength: NAME_MAX_LENGTH,
      match: [ NAME_REGEXP, 'Last name can contain just latin symbols, digits, underscores and single quotes' ],
    },
    email: {
      type: String,
      required: [ true, 'Email can not be empty' ],
      index: { unique: true },
      lowercase: true,
      // @ts-ignore
      match: [ EMAIL_REGEXP, 'Email should be valid' ],
      maxLength: PROPERTY_LENGTH_64,
    },
    avatar: {
      type: String,
      validate: optionalRange(0, IMAGE_BASE64_MAX_LENGTH),
    },
    addresses: {
      type: [Schema.Types.ObjectId],
      ref: 'Address',
    },
    phoneNumber: {
      type: String,
      validate: optionalRange(PHONE_NUMBER_MIN_LENGTH, PHONE_NUMBER_MAX_LENGTH),
    },
    role: {
      type: String,
      default: ROLE.USER,
      enum: [
        ROLE.SUPERADMIN,
        ROLE.ADMIN,
        ROLE.USER,
        ROLE.GUEST,
      ],
    },
    companies: [MembershipSchema],
    brands: [MembershipSchema],
    emailConfirmed: {
      type: Schema.Types.Boolean,
      required: [ true, 'Email confirmation field can not be empty' ],
    },
    phoneConfirmed: {
      type: Schema.Types.Boolean,
      required: [ true, 'Phone confirmation field can not be empty' ],
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
      transform: safeValue,
    },
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: safeValue,
    },
  },
);

VendorSchema.methods = {
  getEncryptedPassword(password: string) {
    return bcrypt.hash(String(password), SALT_ROUNDS);
  },

  async compareEncryptedPassword(password: string) {
    return await bcrypt.compare(password, this.password);
  },
};

VendorSchema.pre<IVendorDocument>('save', async function(next) {
  const self = this as IVendorDocument;

  self.email = self.email.toLowerCase();

  if (!this.isModified('password')) {
    return next();
  }
  // @ts-ignore
  self.password = await self.getEncryptedPassword(self.password);
  next();
});

VendorSchema.pre<IVendorDocument>('updateOne', async function(next) {
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

export const VendorModel = mongoose.model<IVendorDocument, mongoose.Model<IVendorDocument>>('Vendor', VendorSchema);
