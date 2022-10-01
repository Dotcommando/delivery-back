import { PickType } from '@nestjs/mapped-types';

import { UserDto } from '../common/dto';


export class DeleteUserBodyDto extends PickType (UserDto, ['_id'] as const) {}
