import { PickType } from '@nestjs/swagger';

import { VendorDto } from '../common/dto';


export class ReadVendorParamDto extends PickType(VendorDto, ['_id']) {}
