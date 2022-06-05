import { HttpStatus } from '@nestjs/common';

import { IResponse } from '../interfaces';

export class ErrorResponse implements IResponse<null> {
  public status: number | HttpStatus;
  public data: null;
  public errors: string[];

  constructor(status: number | HttpStatus, errorMessages: string[] | string) {
    this.status = status;

    this.errors = Array.isArray(errorMessages)
      ? [...errorMessages]
      : [errorMessages];
  }
}
