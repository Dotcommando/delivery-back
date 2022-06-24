import { PickType } from '@nestjs/mapped-types';

import { NotNull, ValidateIfNull } from '../common/decorators';
import { PartialUserDto } from '../common/dto';


export class UpdateUserBodyDto extends PickType(
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
