import { HttpException, HttpStatus } from '@nestjs/common';

import { MongoError } from 'mongodb';

import { AddressedHttpException } from '../exceptions';

export function createAddressedException(
  address: string,
  e: Error | HttpException | AddressedHttpException | MongoError,
): AddressedHttpException {
  const message = e instanceof MongoError
    ? process.env.ENVIRONMENT === 'prod'
      ? 'Database error'
      : e.message
    : e.message;
  throw new AddressedHttpException(
    address,
    message,
    (e as HttpException)?.getStatus ? (e as HttpException).getStatus() : HttpStatus.PRECONDITION_FAILED,
  );
}
