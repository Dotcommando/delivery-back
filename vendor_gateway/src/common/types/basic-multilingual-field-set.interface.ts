import { SUPPORTED_LANGUAGES } from '../constants';


export interface IBasicMultilingualFieldSet {
  lang: SUPPORTED_LANGUAGES;
  title?: string;
  shortDescription?: string;
  description?: string;
  keywords?: string;
}
