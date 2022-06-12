import { IntersectionType, PickType } from '@nestjs/swagger';

import { PartialUserDto, UserDto } from '../common/dto';


export class SignInBodyDto extends IntersectionType(
  PickType(UserDto, ['password'] as const),
  PickType(PartialUserDto, [ 'email', 'username' ] as const),
) {}
