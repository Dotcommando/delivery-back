import { PickType } from '@nestjs/mapped-types';

import { BrandDto } from '../common/dto';


export class DeleteBrandBodyDto extends PickType(BrandDto, ['_id'] as const) {}
