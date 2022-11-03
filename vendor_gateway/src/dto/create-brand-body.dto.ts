import { OmitType } from '@nestjs/mapped-types';

import { BrandDto } from '../common/dto';


export class CreateBrandBodyDto extends OmitType(BrandDto, ['_id']) {}
