import { PickType } from '@nestjs/swagger';

import { BrandDto } from '../common/dto';


export class ReadBrandBodyDto extends PickType(BrandDto, ['_id']) {}
