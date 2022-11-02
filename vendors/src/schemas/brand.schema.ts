import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

import {
  BRAND_DESCRIPTION_EN_MAX_LENGTH,
  BRAND_DESCRIPTION_HY_MAX_LENGTH,
  BRAND_DESCRIPTION_RU_MAX_LENGTH,
  BRAND_KEYWORDS_EN_MAX_LENGTH,
  BRAND_KEYWORDS_HY_MAX_LENGTH,
  BRAND_KEYWORDS_RU_MAX_LENGTH,
  BRAND_SHORT_DESCRIPTION_EN_MAX_LENGTH,
  BRAND_SHORT_DESCRIPTION_HY_MAX_LENGTH,
  BRAND_SHORT_DESCRIPTION_RU_MAX_LENGTH,
  BRAND_TITLE_EN_MAX_LENGTH,
  BRAND_TITLE_HY_MAX_LENGTH,
  BRAND_TITLE_RU_MAX_LENGTH,
  IMAGE_ADDRESS_MAX_LENGTH,
  SUPPORTED_LANGUAGES,
  SUPPORTED_LANGUAGES_ARRAY,
} from '../common/constants';
import {
  IBrandDocument,
  IBrandMultilingualFieldSetDoc,
} from '../common/types';
import { optionalRange } from '../validators';


export const BrandSchema = new Schema<IBrandDocument, mongoose.Model<IBrandDocument>>(
  {
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: [ true, 'Each brand must be related with a company' ],
    },
    backgroundLight: {
      type: String,
      validate: optionalRange(0, IMAGE_ADDRESS_MAX_LENGTH),
    },
    backgroundDark: {
      type: String,
      validate: optionalRange(0, IMAGE_ADDRESS_MAX_LENGTH),
    },
    logo: {
      type: String,
      validate: optionalRange(0, IMAGE_ADDRESS_MAX_LENGTH),
    },
    translations: [
      BrandFieldSetFn(SUPPORTED_LANGUAGES.HY),
      BrandFieldSetFn(SUPPORTED_LANGUAGES.RU),
      BrandFieldSetFn(SUPPORTED_LANGUAGES.EN),
    ],
  },
  {
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: prepareValue,
    },
  },
);

export const BrandModel = mongoose.model<IBrandDocument, mongoose.Model<IBrandDocument>>('Brand', BrandSchema);

function prepareValue(doc, ret: { [key: string]: unknown }) {
  delete ret.id;
}

function BrandFieldSetFn(lang: SUPPORTED_LANGUAGES): Schema<IBrandMultilingualFieldSetDoc, mongoose.Model<IBrandMultilingualFieldSetDoc>> {
  return new Schema<IBrandMultilingualFieldSetDoc, mongoose.Model<IBrandMultilingualFieldSetDoc>>(
    {
      lang: {
        type: String,
        enum: [...SUPPORTED_LANGUAGES_ARRAY],
        required: [ true, 'Each translation set must related with a language' ],
      },
      fullName: fullNameFn(lang),
      shortName: shortNameFn(lang),
      title: titleFn(lang),
      shortDescription: shortDescriptionFn(lang),
      description: descriptionFn(lang),
      keywords: keywordsFn(lang),
    },
  );
}

function titleMaxLength(lang: SUPPORTED_LANGUAGES): number {
  switch (lang) {
    case SUPPORTED_LANGUAGES.HY:
      return BRAND_TITLE_HY_MAX_LENGTH;
    case SUPPORTED_LANGUAGES.RU:
      return BRAND_TITLE_RU_MAX_LENGTH;
    case SUPPORTED_LANGUAGES.EN:
      return BRAND_TITLE_EN_MAX_LENGTH;
    default:
      return BRAND_TITLE_HY_MAX_LENGTH;
  }
}

function shortDescriptionMaxLength(lang: SUPPORTED_LANGUAGES): number {
  switch (lang) {
    case SUPPORTED_LANGUAGES.HY:
      return BRAND_SHORT_DESCRIPTION_HY_MAX_LENGTH;
    case SUPPORTED_LANGUAGES.RU:
      return BRAND_SHORT_DESCRIPTION_RU_MAX_LENGTH;
    case SUPPORTED_LANGUAGES.EN:
      return BRAND_SHORT_DESCRIPTION_EN_MAX_LENGTH;
    default:
      return BRAND_SHORT_DESCRIPTION_HY_MAX_LENGTH;
  }
}

function descriptionMaxLength(lang: SUPPORTED_LANGUAGES): number {
  switch (lang) {
    case SUPPORTED_LANGUAGES.HY:
      return BRAND_DESCRIPTION_HY_MAX_LENGTH;
    case SUPPORTED_LANGUAGES.RU:
      return BRAND_DESCRIPTION_RU_MAX_LENGTH;
    case SUPPORTED_LANGUAGES.EN:
      return BRAND_DESCRIPTION_EN_MAX_LENGTH;
    default:
      return BRAND_DESCRIPTION_HY_MAX_LENGTH;
  }
}

function keywordsMaxLength(lang: SUPPORTED_LANGUAGES): number {
  switch (lang) {
    case SUPPORTED_LANGUAGES.HY:
      return BRAND_KEYWORDS_HY_MAX_LENGTH;
    case SUPPORTED_LANGUAGES.RU:
      return BRAND_KEYWORDS_RU_MAX_LENGTH;
    case SUPPORTED_LANGUAGES.EN:
      return BRAND_KEYWORDS_EN_MAX_LENGTH;
    default:
      return BRAND_KEYWORDS_HY_MAX_LENGTH;
  }
}

function shortNameFn<T>(lang: SUPPORTED_LANGUAGES) {
  return {
    type: String,
    maxLength: titleMaxLength(lang),
  };
}

function fullNameFn<T>(lang: SUPPORTED_LANGUAGES) {
  return {
    type: String,
    maxLength: titleMaxLength(lang),
  };
}

function titleFn<T>(lang: SUPPORTED_LANGUAGES) {
  return {
    type: String,
    maxLength: titleMaxLength(lang),
  };
}

function shortDescriptionFn<T>(lang: SUPPORTED_LANGUAGES) {
  return {
    type: String,
    maxLength: shortDescriptionMaxLength(lang),
  };
}

function descriptionFn<T>(lang: SUPPORTED_LANGUAGES) {
  return {
    type: String,
    maxLength: descriptionMaxLength(lang),
  };
}

function keywordsFn<T>(lang: SUPPORTED_LANGUAGES) {
  return {
    type: String,
    maxLength: keywordsMaxLength(lang),
  };
}
