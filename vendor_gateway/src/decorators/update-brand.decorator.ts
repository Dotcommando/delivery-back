import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiPreconditionFailedResponse,
} from '@nestjs/swagger';

import {
  CommonForbiddenResponseDto,
  UpdateBrandBadRequestResponseDto,
  UpdateBrandPreconditionFailedResponseDto,
  UpdateBrandSuccessResponseDto,
} from '../dto';


export function UpdateBrand() {
  return applyDecorators(
    ApiOkResponse({
      description: 'Successful Brand update.',
      type: UpdateBrandSuccessResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'When one of fields did not pass validation',
      type: UpdateBrandBadRequestResponseDto,
    }),
    ApiPreconditionFailedResponse({
      description: 'When DB is out of work',
      type: UpdateBrandPreconditionFailedResponseDto,
    }),
    ApiForbiddenResponse({
      description: 'If the access token is expired.',
      type: CommonForbiddenResponseDto,
    }),
  );
}
