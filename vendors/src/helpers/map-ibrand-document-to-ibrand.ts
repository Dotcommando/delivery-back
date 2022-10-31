import { Types } from 'mongoose';

import {
  IBrand,
  IBrandDocument,
  IBrandMultilingualFieldSet,
  IBrandMultilingualFieldSetDoc,
} from '../common/types';


export function mapIBrandDocumentToIBrand(brand: IBrandDocument): IBrand {
  return {
    _id: new Types.ObjectId(String(brand._id)),
    company: brand.company,
    backgroundLight: brand.backgroundLight,
    backgroundDark: brand.backgroundDark,
    logo: brand.logo,
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
