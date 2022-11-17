import { Document, Types } from 'mongoose';

export interface IAddress {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  postalCode?: string;
  country: string;
  region?: string;
  city: string;
  street: string;
  building: string;
  flat?: string;
}

export interface IAddressDocument extends Omit<IAddress, '_id'>, Document {
}
