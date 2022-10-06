import { PickType } from '@nestjs/mapped-types';

import { UserDto } from '../common/dto';


export class UpdateUserParamDto extends PickType(UserDto, ['_id'] as const) {}
