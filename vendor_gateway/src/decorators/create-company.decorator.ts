import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiPreconditionFailedResponse,
} from '@nestjs/swagger';

import {
  CommonForbiddenResponseDto,
  CreateCompanyBadRequestResponseDto,
  CreateCompanyConflictResponseDto,
  CreateCompanyPreconditionFailedResponseDto,
  CreateCompanySuccessResponseDto,
} from '../dto';


export function CreateCompany() {
  return applyDecorators(
    ApiOkResponse({
      description: 'Successful Company creation.',
      type: CreateCompanySuccessResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'When one of fields did not pass validation',
      type: CreateCompanyBadRequestResponseDto,
    }),
    ApiConflictResponse({
      description: 'When company email is already in use',
      type: CreateCompanyConflictResponseDto,
    }),
    ApiPreconditionFailedResponse({
      description: 'When an internal error happened.',
      type: CreateCompanyPreconditionFailedResponseDto,
    }),
    ApiForbiddenResponse({
      description: 'If the access token is expired.',
      type: CommonForbiddenResponseDto,
    }),
  );
}
