import { HttpException } from '@nestjs/common';

export class AddressedHttpException extends HttpException {
  constructor(public errorAddress: string, public errorMessage: string, public statusCode: number) {
    super(errorMessage, statusCode);
  }

  getErrorAddress(): string {
    return this.errorAddress;
  }

  getErrorMessage(): string {
    return this.errorMessage;
  }

  getStatusCode(): number {
    return this.statusCode;
  }
}
