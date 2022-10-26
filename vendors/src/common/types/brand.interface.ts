import { Document, Types } from 'mongoose';

import { IBasicMultilingualFieldSet } from './basic-multilingual-field-set.interface';


export interface IBrand {
  _id: Types.ObjectId;
  company: Types.ObjectId;
  backgroundLight: string;
  backgroundDark: string;
  logo: string;
  translations: ILangFieldSet[];
}

export interface ILangFieldSet {
  [lang: string]: IBrandMultilingualFieldSet | unknown;
}

export interface ILangFieldSetDoc extends Omit<ILangFieldSet, '_id'>, Document<ILangFieldSet> {
}

export interface IBrandMultilingualFieldSet extends IBasicMultilingualFieldSet {
  fullName?: string;
  shortName?: string;
}

export interface IBrandMultilingualFieldSetDoc extends Omit<IBrandMultilingualFieldSet, '_id'>, Document<IBrandMultilingualFieldSet> {
}

export interface IBrandDocument extends Omit<IBrand, '_id'>, Document<IBrand> {
}
