import { PickType } from '@nestjs/swagger';

import { UserDto } from '../common/dto';


export class SignInBodyDto extends PickType(UserDto, [ 'email', 'password' ]) {}
