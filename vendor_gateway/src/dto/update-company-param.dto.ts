import { PickType } from '@nestjs/mapped-types';

import { CompanyDto } from '../common/dto';


export class UpdateCompanyParamDto extends PickType(CompanyDto, ['_id'] as const) {}
