import { Document, Types } from 'mongoose';

import { LEGAL_ENTITY } from '../constants';


export interface ICompany {
  _id: Types.ObjectId;
  legalEntity: LEGAL_ENTITY;
  fullName: string;
  shortName: string;
  email: string;
  phoneNumber: string;
  emailConfirmed: boolean;
  phoneConfirmed: boolean;
  legalAddress: Types.ObjectId;
  actualAddress: Types.ObjectId;
  bankData: string;
  managers: Types.ObjectId[];
  note?: string;
}

export interface ICompanyDocument extends Omit<ICompany, '_id'>, Document<ICompany> {
}
