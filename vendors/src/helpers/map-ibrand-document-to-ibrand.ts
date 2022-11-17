import ObjectId from 'bson-objectid';

import { IBrand, IBrandMultilingualFieldSet } from '../common/types';
import { IBrandDocument, IBrandMultilingualFieldSetDoc } from '../types';


export function mapIBrandDocumentToIBrand(brand: IBrandDocument): IBrand {
  return {
    _id: new ObjectId(String(brand._id)),
    company: brand.company,
    ...(brand.backgroundLight && { backgroundLight: brand.backgroundLight }),
    ...(brand.backgroundDark && { backgroundDark: brand.backgroundDark }),
    ...(brand.logoLight && { logoLight: brand.logoLight }),
    ...(brand.logoDark && { logoDark: brand.logoDark }),
    translations: brand.translations?.length
      ? brand.translations.map((translationSet: IBrandMultilingualFieldSetDoc) => ({
        lang: translationSet.lang,
        ...(translationSet?.fullName && { fullName: translationSet.fullName }),
        ...(translationSet?.shortName && { shortName: translationSet.shortName }),
        ...(translationSet?.title && { title: translationSet.title }),
        ...(translationSet?.shortDescription && { shortDescription: translationSet.shortDescription }),
        ...(translationSet?.description && { description: translationSet.description }),
        ...(translationSet?.keywords && { keywords: translationSet.keywords }),
      } as IBrandMultilingualFieldSet))
      : [],
  };
}
