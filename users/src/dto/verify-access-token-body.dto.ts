import { PickType } from '@nestjs/swagger';

import { TokenDto } from '../common/dto';

export class VerifyAccessTokenBodyDto extends PickType(TokenDto, ['accessToken'] as const) {}
