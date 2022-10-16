import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { FILES_EVENTS } from './common/constants';
import { TcpCommonExceptionFilter } from './common/filters';
import { IResponse } from './common/types';
import { FileService } from './services';


@UseFilters(new TcpCommonExceptionFilter())
@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @MessagePattern(FILES_EVENTS.FILE_INIT_FILE_SAVING)
  public async vendorRegister(file: any): Promise<IResponse<{ done: boolean }>> {
    return await this.fileService.avatarProcessing(file);
  }
}
