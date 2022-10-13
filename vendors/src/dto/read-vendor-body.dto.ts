import { PickType } from '@nestjs/swagger';

import { VendorDto } from '../common/dto';


export class ReadVendorBodyDto extends PickType(VendorDto, ['_id']) {}
