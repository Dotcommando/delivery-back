import * as mongoose from 'mongoose';

import { IAddressDocument } from '../common/interfaces';


const Schema = mongoose.Schema;

export const AddressSchema = new Schema<IAddressDocument, mongoose.Model<IAddressDocument>>(
  {
    postalCode: {
      type: String,
      required: [ true, 'Postal code is required' ],
    },
    country: {
      type: String,
      required: [ true, 'Country is required' ],
    },
    city: {
      type: String,
      required: [ true, 'City is required' ],
    },
    street: {
      type: String,
      required: [ true, 'Street is required' ],
    },
    building: {
      type: String,
      required: [ true, 'Building is required' ],
    },
  },
);

export const AddressModel = mongoose.model<IAddressDocument, mongoose.Model<IAddressDocument>>('Address', AddressSchema);
