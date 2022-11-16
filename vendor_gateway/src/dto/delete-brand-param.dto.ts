import { PickType } from '@nestjs/swagger';

import { BrandDto } from '../common/dto';


export class DeleteBrandParamDto extends PickType(BrandDto, ['_id']) {}
