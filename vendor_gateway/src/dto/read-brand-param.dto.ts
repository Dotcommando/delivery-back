import { PickType } from '@nestjs/swagger';

import { BrandDto } from '../common/dto';


export class ReadBrandParamDto extends PickType(BrandDto, ['_id']) {}