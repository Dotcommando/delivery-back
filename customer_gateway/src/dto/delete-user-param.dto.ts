import { PickType } from '@nestjs/swagger';

import { UserDto } from '../common/dto';


export class DeleteUserParamDto extends PickType(UserDto, ['_id']) {}
