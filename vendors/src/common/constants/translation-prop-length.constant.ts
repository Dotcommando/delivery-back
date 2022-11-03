import { SUPPORTED_LANGUAGES_ARRAY } from './supported-languages.enum';

import { IBrandMultilingualFieldSet } from '../types';


export const TRANSLATION_PROP_LENGTH = {};

const propsNamesToCheck: Array<keyof IBrandMultilingualFieldSet> = [
  'fullName',
  'shortName',
  'title',
  'shortDescription',
  'description',
  'keywords',
];

for (const lang of SUPPORTED_LANGUAGES_ARRAY) {
  TRANSLATION_PROP_LENGTH[lang] = {};

  for (const fieldName of propsNamesToCheck) {
    const uppercaseLang = lang.toUpperCase();
    const titleLength = parseInt(process.env[`BRAND_TITLE_${uppercaseLang}_MAX_LENGTH`]);

    if (fieldName === 'fullName') {
      TRANSLATION_PROP_LENGTH[lang][fieldName] = titleLength;
    } else if (fieldName === 'shortName') {
      TRANSLATION_PROP_LENGTH[lang][fieldName] = titleLength;
    } else if (fieldName === 'title') {
      TRANSLATION_PROP_LENGTH[lang][fieldName] = titleLength;
    } else if (fieldName === 'shortDescription') {
      TRANSLATION_PROP_LENGTH[lang][fieldName] = parseInt(process.env[`BRAND_SHORT_DESCRIPTION_${uppercaseLang}_MAX_LENGTH`]);
    } else if (fieldName === 'description') {
      TRANSLATION_PROP_LENGTH[lang][fieldName] = parseInt(process.env[`BRAND_DESCRIPTION_${uppercaseLang}_MAX_LENGTH`]);
    } else if (fieldName === 'keywords') {
      TRANSLATION_PROP_LENGTH[lang][fieldName] = parseInt(process.env[`BRAND_KEYWORDS_${uppercaseLang}_MAX_LENGTH`]);
    }
  }
}
