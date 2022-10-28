import { Document, Types } from 'mongoose';

import { IBasicMultilingualFieldSet } from './basic-multilingual-field-set.interface';

import { SUPPORTED_LANGUAGES } from '../constants';


export interface IBrand {
  _id: Types.ObjectId;
  company: Types.ObjectId;
  backgroundLight: string;
  backgroundDark: string;
  logo: string;
  translations: IBrandMultilingualFieldSet[];
}

export interface IBrandMultilingualFieldSet extends IBasicMultilingualFieldSet {
  lang: SUPPORTED_LANGUAGES;
  fullName?: string;
  shortName?: string;
}

export interface IBrandMultilingualFieldSetDoc extends Omit<IBrandMultilingualFieldSet, '_id'>, Document<IBrandMultilingualFieldSet> {
}

export interface IBrandDocument extends Omit<IBrand, '_id'>, Document<IBrand> {
}
