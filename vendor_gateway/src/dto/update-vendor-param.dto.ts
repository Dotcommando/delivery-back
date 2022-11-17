import { PickType } from '@nestjs/mapped-types';

import { VendorDto } from '../common/dto';


export class UpdateVendorParamDto extends PickType(VendorDto, ['_id'] as const) {}
