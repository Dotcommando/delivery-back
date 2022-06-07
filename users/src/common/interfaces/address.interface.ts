import { ObjectId } from 'mongoose';

export interface IAddress {
  _id: ObjectId;
  postalCode: string;
  country: string;
  city: string;
  street: string;
  building: string;
}

export interface IAddressDocument extends Omit<IAddress, '_id'>, Document {
}
