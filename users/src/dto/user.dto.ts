import {
  Transform,
  TransformFnParams,
  Type,
} from 'class-transformer';
import { IsDefined } from 'class-validator';
import { ObjectId, Types } from 'mongoose';

import { toObjectId } from '../common/helpers/to-object-id';
import { IUser } from '../common/interfaces';

// export class UserDto implements IUser {
export class UserDto {
  @IsDefined()
  // @Transform(({ value }) => new Types.ObjectId(value), { toClassOnly: true })
  @Transform((data: TransformFnParams) => toObjectId({ value: data.value, key: data.key }))
  @Type(() => Types.ObjectId)
  _id: ObjectId;
}
