import { applyDecorators } from '@nestjs/common';
import { ApiForbiddenResponse, ApiOkResponse, ApiPreconditionFailedResponse } from '@nestjs/swagger';

import {
  CommonForbiddenResponseDto,
  ReissueTokensPreconditionFailedResponseDto,
  ReissueTokensSuccessResponseDto,
} from '../dto';


export function ReissueTokens() {
  return applyDecorators(
    ApiOkResponse({
      description: 'In \'authorization\' header the back received unexpired refresh token and expired access token in the \'accessToken\' field of the body.',
      type: ReissueTokensSuccessResponseDto,
    }),
    ApiPreconditionFailedResponse({
      description: 'If the access token received from the body was corrupted.',
      type: ReissueTokensPreconditionFailedResponseDto,
    }),
    ApiForbiddenResponse({
      description: 'If the refresh token received from the \'authorization\' header is expired.',
      type: CommonForbiddenResponseDto,
    }),
  );
}
