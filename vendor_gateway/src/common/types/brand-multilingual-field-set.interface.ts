import { IBasicMultilingualFieldSet, IUpdateBasicMultilingualFieldSet } from './basic-multilingual-field-set.interface';

import { SUPPORTED_LANGUAGES } from '../constants';


export interface IBrandMultilingualFieldSet extends IBasicMultilingualFieldSet {
  lang: SUPPORTED_LANGUAGES;
  fullName?: string;
  shortName?: string;
}

export interface IUpdateBrandMultilingualFieldSet extends IUpdateBasicMultilingualFieldSet {
  lang: SUPPORTED_LANGUAGES;
  fullName?: string | null;
  shortName?: string | null;
}
