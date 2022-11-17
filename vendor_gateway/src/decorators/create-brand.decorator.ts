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
      description: 'When one of fields did not pass validation',
      type: CreateBrandBadRequestResponseDto,
    }),
    ApiPreconditionFailedResponse({
      description: 'When an internal error happened.',
      type: CreateBrandPreconditionFailedResponseDto,
    }),
    ApiForbiddenResponse({
      description: 'If the access token is expired.',
      type: CommonForbiddenResponseDto,
    }),
  );
}
