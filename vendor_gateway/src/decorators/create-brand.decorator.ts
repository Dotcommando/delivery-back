import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiPreconditionFailedResponse,
} from '@nestjs/swagger';

import {
  CommonForbiddenResponseDto,
  CreateBrandBadRequestResponseDto,
  CreateBrandPreconditionFailedResponseDto,
  CreateBrandSuccessResponseDto,
} from '../dto';


export function CreateBrand() {
  return applyDecorators(
    ApiOkResponse({
      description: 'Successful Brand creation.',
      type: CreateBrandSuccessResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'When one of field did not pass validation',
      type: CreateBrandBadRequestResponseDto,
    }),
    ApiPreconditionFailedResponse({
      description: 'When DB is out of work',
      type: CreateBrandPreconditionFailedResponseDto,
    }),
    ApiForbiddenResponse({
      description: 'If the access token is expired.',
      type: CommonForbiddenResponseDto,
    }),
  );
}
