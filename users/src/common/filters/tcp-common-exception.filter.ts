import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';

import { ErrorResponse } from '../classes';
import { AddressedHttpException } from '../exceptions';


@Catch()
export class TcpCommonExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const status = exception?.getStatus && typeof exception.getStatus === 'function'
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    return new ErrorResponse(status, getExceptionsMessages(exception));
  }
}

export function getExceptionsMessages(exception: HttpException | Error): string[] {
  const errorMessages = [];

  if (exception instanceof HttpException) {
    errorMessages.push(
      typeof exception?.getResponse() === 'string'
        ? exception.getResponse() as string
        : JSON.stringify(exception.getResponse()),
    );

    if (exception instanceof AddressedHttpException) {
      errorMessages.push('Error address: ' + exception.getErrorAddress());
    }
  } else {
    if (exception?.message && typeof exception.message === 'string') {
      errorMessages.push(exception.message);
    }
  }

  return  errorMessages;
}