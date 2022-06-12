import { PickType } from '@nestjs/swagger';

import { TokenDto } from '../common/dto';


export class ReissueTokensBodyDto extends PickType(TokenDto, ['accessToken']) {}
