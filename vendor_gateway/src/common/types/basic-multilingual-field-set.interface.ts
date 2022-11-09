import { SUPPORTED_LANGUAGES } from '../constants';


export interface IBasicMultilingualFieldSet {
  lang: SUPPORTED_LANGUAGES;
  title?: string;
  shortDescription?: string;
  description?: string;
  keywords?: string;
}

export interface IUpdateBasicMultilingualFieldSet {
  lang: SUPPORTED_LANGUAGES;
  title?: string | null;
  shortDescription?: string | null;
  description?: string | null;
  keywords?: string | null;
}
