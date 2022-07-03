import { Injectable } from '@nestjs/common';


@Injectable()
export class VendorsService {
  public async createVendor(): Promise<string> {
    return 'Hello World!';
  }
}
