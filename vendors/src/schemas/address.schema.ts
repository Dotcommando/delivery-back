import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

import {
  POSTAL_CODE_MAX_LENGTH,
  POSTAL_CODE_MIN_LENGTH,
  PROPERTY_LENGTH_1,
  PROPERTY_LENGTH_4,
  PROPERTY_LENGTH_64,
} from '../common/constants';
import { IAddressDocument } from '../common/types';
import { optionalRange } from '../validators';


export const AddressSchema = new Schema<IAddressDocument, mongoose.Model<IAddressDocument>>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [ true, 'UserId field can not be empty' ],
      index: true,
    },
    postalCode: {
      type: String,
      validate: optionalRange(POSTAL_CODE_MIN_LENGTH, POSTAL_CODE_MAX_LENGTH),
    },
    country: {
      type: String,
      minLength: PROPERTY_LENGTH_1,
      maxLength: PROPERTY_LENGTH_64,
      required: [ true, 'Country is required' ],
    },
    region: {
      type: String,
      validate: optionalRange(0, PROPERTY_LENGTH_64),
    },
    city: {
      type: String,
      minLength: PROPERTY_LENGTH_1,
      maxLength: PROPERTY_LENGTH_64,
      required: [ true, 'City is required' ],
    },
    street: {
      type: String,
      minLength: PROPERTY_LENGTH_1,
      maxLength: PROPERTY_LENGTH_64,
      required: [ true, 'Street is required' ],
    },
    building: {
      type: String,
      minLength: PROPERTY_LENGTH_1,
      maxLength: PROPERTY_LENGTH_64,
      required: [ true, 'Building is required' ],
    },
    flat: {
      type: String,
      validate: optionalRange(PROPERTY_LENGTH_1, PROPERTY_LENGTH_4),
    },
  },
);

export const AddressModel = mongoose.model<IAddressDocument, mongoose.Model<IAddressDocument>>('Address', AddressSchema);
