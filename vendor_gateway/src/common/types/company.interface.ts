import ObjectId from 'bson-objectid';

import { IAddress } from './address.interface';

import { LEGAL_ENTITY } from '../constants';


export interface ICompany<T_id = ObjectId, TAddress = ObjectId, TManager = ObjectId> {
  _id: T_id;
  legalEntity: LEGAL_ENTITY;
  fullName: string;
  shortName: string;
  email: string;
  phoneNumber: string;
  emailConfirmed: boolean;
  phoneConfirmed: boolean;
  legalAddress: TAddress;
  actualAddress: TAddress;
  bankData: string;
  managers: TManager[];
  note?: string;
}

export interface ICompanyTCP extends ICompany<string, IAddress<string, string>, string> {}
