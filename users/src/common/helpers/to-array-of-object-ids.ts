import { BadRequestException } from '@nestjs/common';

import { TransformFnParams } from 'class-transformer';

import { toObjectId } from './to-object-id';

export const toArrayOfObjectIds = (fieldName: string) => (data: TransformFnParams) => {
  if (!Array.isArray(data.value)) {
    throw new BadRequestException(`${fieldName} must be an array of ObjectIds`);
  }

  return (data.value as string[]).map((objId) => toObjectId({
    value: objId,
    key: `One of elements of ${fieldName} array`,
  }));
};
