import { applyDecorators } from '@nestjs/common';
import { ApiBadRequestResponse, ApiForbiddenResponse, ApiOkResponse } from '@nestjs/swagger';

import { CommonForbiddenResponseDto, LogoutBadRequestResponseDto, LogoutSuccessResponseDto } from '../dto';


export function Logout() {
  return applyDecorators(
    ApiOkResponse({
      description: 'Successful logout response contains names of user for goodbye.',
      type: LogoutSuccessResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'If refresh token is damaged.',
      type: LogoutBadRequestResponseDto,
    }),
    ApiForbiddenResponse({
      description: 'If access expired.',
      type: CommonForbiddenResponseDto,
    }),
  );
}
