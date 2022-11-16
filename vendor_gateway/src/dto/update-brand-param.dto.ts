import { PickType } from '@nestjs/swagger';

import { BrandDto } from '../common/dto';


export class UpdateBrandParamDto extends PickType(BrandDto, ['_id']) {}
