import { Document, Types } from 'mongoose';

export interface IAddress {
  _id: Types.ObjectId;
  postalCode: string;
  country: string;
  region: string;
  city: string;
  street: string;
  building: string;
}

export interface IAddressDocument extends Omit<IAddress, '_id'>, Document {
}
