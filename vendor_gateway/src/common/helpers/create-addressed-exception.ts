import { HttpException, HttpStatus } from '@nestjs/common';

import { MongoError } from 'mongodb';

import { AddressedHttpException } from '../exceptions';

export function createAddressedException(
  e: Error | HttpException | AddressedHttpException | MongoError,
  address: string,
): AddressedHttpException {
  const message = e instanceof MongoError
    ? process.env.ENVIRONMENT === 'prod'
      ? 'Database error'
      : e.message
    : e.message;

  throw new AddressedHttpException(
    (e as HttpException)?.getStatus ? (e as HttpException).getStatus() : HttpStatus.PRECONDITION_FAILED,
    address,
    message,
  );
}
