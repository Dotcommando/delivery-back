import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiPreconditionFailedResponse,
} from '@nestjs/swagger';

import { CommonForbiddenResponseDto,
  UpdateCompanyBadRequestResponseDto,
  UpdateCompanyConflictResponseDto,
  UpdateCompanyPreconditionFailedResponseDto,
  UpdateCompanySuccessResponseDto } from '../dto';


export function UpdateCompany() {
  return applyDecorators(
    ApiOkResponse({
      description: 'Successful Company updation.',
      type: UpdateCompanySuccessResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'When one of fields did not pass validation',
      type: UpdateCompanyBadRequestResponseDto,
    }),
    ApiConflictResponse({
      description: 'When company email is already in use',
      type: UpdateCompanyConflictResponseDto,
    }),
    ApiPreconditionFailedResponse({
      description: 'When an internal error happened.',
      type: UpdateCompanyPreconditionFailedResponseDto,
    }),
    ApiForbiddenResponse({
      description: 'If the access token is expired.',
      type: CommonForbiddenResponseDto,
    }),
  );
}
