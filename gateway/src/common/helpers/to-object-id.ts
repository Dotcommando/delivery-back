import { BadRequestException } from '@nestjs/common';

import { Types } from 'mongoose';

export function toObjectId({ value, key }: { [key: string]: string }): Types.ObjectId {
  if (!Types.ObjectId.isValid(value) || String(value) !== value) {
    throw new BadRequestException(`${key} is not a valid ObjectId`);
  }

  return new Types.ObjectId(value);
}
