import { PickType } from '@nestjs/swagger';

import { VendorDto } from '../common/dto';


export class GetUserParamDto extends PickType(VendorDto, ['_id']) {}
