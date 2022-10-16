import {
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AddressedErrorCatching } from '../common/decorators';
import { IResponse } from '../common/types';


@Injectable()
export class FileService {
  constructor(
    private readonly configService: ConfigService,
  ) {
  }

  @AddressedErrorCatching()
  public async avatarProcessing(file: any): Promise<IResponse<{ done: true }>> {
    return {
      status: HttpStatus.CREATED,
      data: {
        done: true,
      },
      errors: null,
    };
  }
}
