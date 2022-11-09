import { SUPPORTED_LANGUAGES_ARRAY } from '../common/constants';
import {
  IBrandMultilingualFieldSet,
  IUpdateBasicMultilingualFieldSet,
} from '../common/types';
import { IBrandMultilingualFieldSetDoc } from '../types';


export function applyTranslations(
  updates: IUpdateBasicMultilingualFieldSet[],
  translations: Array<IBrandMultilingualFieldSetDoc | IBrandMultilingualFieldSet>,
): Array<IBrandMultilingualFieldSetDoc | IBrandMultilingualFieldSet> {
  if (!updates.length) {
    return translations;
  }

  const filteredUpdates: IUpdateBasicMultilingualFieldSet[] = updates
    .filter((tr: IUpdateBasicMultilingualFieldSet) => tr.lang && SUPPORTED_LANGUAGES_ARRAY.includes(tr.lang));

  for (const updatesTranslation of filteredUpdates) {
    if (!translations.find((translation: IBrandMultilingualFieldSetDoc) => translation.lang === updatesTranslation.lang)) {
      translations.push({ lang: updatesTranslation.lang });
    }

    const translationFromDoc = translations
      .find((translation: IBrandMultilingualFieldSetDoc) => translation.lang === updatesTranslation.lang);

    for (const key in updatesTranslation) {
      if (updatesTranslation[key] === null) {
        delete translationFromDoc[key];

        continue;
      }

      translationFromDoc[key] = updatesTranslation[key];
    }
  }

  return translations;
}
