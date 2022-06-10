import { IntersectionType, PickType } from '@nestjs/swagger';

import { PartialUserDto, UserDto } from '../common/dto';

export class RegisterDto extends IntersectionType(
  PickType(UserDto, [ 'firstName', 'lastName', 'email', 'password' ] as const),
  PickType(PartialUserDto, [ 'middleName', 'username' ] as const),
) {}
