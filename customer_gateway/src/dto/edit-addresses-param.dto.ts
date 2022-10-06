import { PickType } from '@nestjs/swagger';

import { UserDto } from '../common/dto';


export class EditAddressesParamDto extends PickType(UserDto, ['_id']) {}
