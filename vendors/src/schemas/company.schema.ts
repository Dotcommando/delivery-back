import { Schema } from 'mongoose';
import * as mongoose from 'mongoose';

import {
  ARMENIAN_COMPANY_NAME_REGEXP,
  BANK_DATA_MAX_LENGTH,
  COMPANY_NAME_MAX_LENGTH,
  COMPANY_NAME_MIN_LENGTH,
  EMAIL_REGEXP,
  LEGAL_ENTITY,
  LEGAL_ENTITY_ARRAY,
  PHONE_NUMBER_MAX_LENGTH,
  PHONE_NUMBER_MIN_LENGTH,
  PROPERTY_LENGTH_64,
} from '../common/constants';
import { ICompanyDocument } from '../common/types';
import { optionalRange } from '../validators';


export const CompanySchema = new Schema<ICompanyDocument, mongoose.Model<ICompanyDocument>>(
  {
    legalEntity: {
      type: String,
      default: LEGAL_ENTITY.SOLE_PROPRIETORSHIP,
      enum: [...LEGAL_ENTITY_ARRAY],
    },
    fullName: {
      type: String,
      required: [ true, 'Full company name is required' ],
      minLength: COMPANY_NAME_MIN_LENGTH,
      maxLength: COMPANY_NAME_MAX_LENGTH,
      match: [ ARMENIAN_COMPANY_NAME_REGEXP, 'Full company name can contain just latin or Armenian symbols, digits, underscores and single quotes' ],
    },
    shortName: {
      type: String,
      required: [ true, 'Short company name is required' ],
      minLength: COMPANY_NAME_MIN_LENGTH,
      maxLength: COMPANY_NAME_MAX_LENGTH,
      match: [ ARMENIAN_COMPANY_NAME_REGEXP, 'Short company name can contain just latin or Armenian symbols, digits, underscores and single quotes' ],
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
    phoneNumber: {
      type: String,
      validate: optionalRange(PHONE_NUMBER_MIN_LENGTH, PHONE_NUMBER_MAX_LENGTH),
    },
    emailConfirmed: {
      type: Schema.Types.Boolean,
      required: [ true, 'Email confirmation field can not be empty' ],
    },
    phoneConfirmed: {
      type: Schema.Types.Boolean,
      required: [ true, 'Phone confirmation field can not be empty' ],
    },
    legalAddress: {
      type: Schema.Types.ObjectId,
      ref: 'Address',
    },
    actualAddress: {
      type: Schema.Types.ObjectId,
      ref: 'Address',
    },
    bankData: {
      type: String,
      maxLength: BANK_DATA_MAX_LENGTH,
    },
    managers: {
      type: [Schema.Types.ObjectId],
      ref: 'Vendor',
    },
    note: {
      type: String,
    },
  },
);

export const CompanyModel = mongoose.model<ICompanyDocument, mongoose.Model<ICompanyDocument>>('Company', CompanySchema);
