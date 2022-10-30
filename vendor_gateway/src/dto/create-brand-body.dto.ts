import { OmitType } from '@nestjs/mapped-types';

import { BrandBodyDto } from '../common/dto';


export class CreateBrandBodyDto extends OmitType(BrandBodyDto, ['_id']) {}
