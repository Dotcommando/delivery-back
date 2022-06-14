import { IntersectionType, PickType } from '@nestjs/swagger';

import { PartialUserDto, UserDto } from '../common/dto';


export class RegisterBodyDto extends IntersectionType(
  PickType(UserDto, [ 'firstName', 'lastName', 'email', 'password' ]),
  PickType(PartialUserDto, [ 'middleName', 'username' ]),
) {}
