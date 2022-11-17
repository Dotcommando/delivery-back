import { PickType } from '@nestjs/swagger';

import { TokenDto } from '../common/dto';

export class LogoutBodyDto extends PickType(TokenDto, ['refreshToken']) {}
