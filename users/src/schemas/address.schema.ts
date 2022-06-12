import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

import {
  POSTAL_CODE_MAX_LENGTH,
  POSTAL_CODE_MIN_LENGTH,
  PROPERTY_LENGTH_1,
  PROPERTY_LENGTH_64,
} from '../common/constants';
import { IAddressDocument } from '../common/types';


export const AddressSchema = new Schema<IAddressDocument, mongoose.Model<IAddressDocument>>(
  {
    postalCode: {
      type: String,
      minLength: POSTAL_CODE_MIN_LENGTH,
      maxLength: POSTAL_CODE_MAX_LENGTH,
      required: [ true, 'Postal code is required' ],
    },
    country: {
      type: String,
      minLength: PROPERTY_LENGTH_1,
      maxLength: PROPERTY_LENGTH_64,
      required: [ true, 'Country is required' ],
    },
    region: {
      type: String,
      maxLength: PROPERTY_LENGTH_64,
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
  },
);

export const AddressModel = mongoose.model<IAddressDocument, mongoose.Model<IAddressDocument>>('Address', AddressSchema);
