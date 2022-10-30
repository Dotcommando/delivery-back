import { BadRequestException } from '@nestjs/common';

import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';
import * as sanitizeHtml from 'sanitize-html';

import { SUPPORTED_LANGUAGES_ARRAY, TRANSLATION_PROP_LENGTH } from '../constants';
import { IBrandMultilingualFieldSet } from '../types';


export function BrandTranslationLength(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name: 'BrandTranslationLength',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const safePropertyName = sanitizeHtml(String(propertyName));
          const translationSet = args.object as IBrandMultilingualFieldSet;
          const language = translationSet.lang;
          const propsNamesToCheck: Array<keyof IBrandMultilingualFieldSet> = [
            'fullName',
            'shortName',
            'title',
            'shortDescription',
            'description',
            'keywords',
          ];

          if (!language || !SUPPORTED_LANGUAGES_ARRAY.includes(language)) {
            throw new BadRequestException(`Language must be a value from list: ${SUPPORTED_LANGUAGES_ARRAY.join(', ')}`);
          }

          if (!propsNamesToCheck.includes(safePropertyName as keyof IBrandMultilingualFieldSet)) {
            throw new BadRequestException(`Translation set has no property with name '${safePropertyName}'`);
          }

          if (typeof translationSet[safePropertyName] !== 'string') {
            throw new BadRequestException(`Field '${safePropertyName}' must be a string`);
          }

          if (translationSet[safePropertyName].length > TRANSLATION_PROP_LENGTH[language][safePropertyName]) {
            throw new BadRequestException(`Field '${safePropertyName}' for language set '${language}' exceeds the maximum number of characters allowed. Maximum number is ${TRANSLATION_PROP_LENGTH[language][safePropertyName]}, the field contains ${translationSet[safePropertyName].length}`);
          }

          return true;
        },
      },
    });
  };
}
