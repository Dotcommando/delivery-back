import { IntersectionType, PickType } from '@nestjs/mapped-types';

import { NotNull, ValidateIfNull } from '../common/decorators';
import { PartialUserDto, UserDto } from '../common/dto';


export class UpdateUserDto extends PickType(
  PartialUserDto,
  [
    'firstName',
    'middleName',
    'lastName',
    'username',
    'avatar',
    'phoneNumber',
    'email',
  ] as const,
) {
  @ValidateIfNull()
  @NotNull()
  firstName: string;

  @ValidateIfNull()
  @NotNull()
  lastName: string;

  @ValidateIfNull()
  @NotNull()
  username: string;

  @ValidateIfNull()
  @NotNull()
  phoneNumber: string;

  @ValidateIfNull()
  @NotNull()
  email: string;
}

export class UpdateUserBodyDto extends IntersectionType(
  UpdateUserDto,
  PickType(UserDto, ['_id'] as const),
) {}
