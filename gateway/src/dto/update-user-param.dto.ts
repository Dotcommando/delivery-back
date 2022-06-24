import { PickType } from '@nestjs/swagger';

import { UserDto } from '../common/dto';


export class UpdateUserParamDto extends PickType(UserDto, ['_id']) {}
