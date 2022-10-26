import { Document, Types } from 'mongoose';

import { IAddress } from './address.interface';
import { LEGAL_ENTITY } from './legal-entity.enum';


export interface ICompany {
  _id: Types.ObjectId;
  legalEntity: LEGAL_ENTITY;
  fullName: string;
  shortName: string;
  email: string;
  phoneNumber: string;
  emailIsConfirmed: boolean;
  phoneIsConfirmed: boolean;
  legalAddress: IAddress;
  actualAddress: IAddress;
  bankData: string;
  managers: Types.ObjectId[];
  note?: string;
}

export interface ICompanyDocument extends Omit<ICompany, '_id'>, Document<ICompany> {
}
