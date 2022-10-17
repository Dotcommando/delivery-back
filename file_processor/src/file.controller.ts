import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { FILES_EVENTS } from './common/constants';
import { TcpCommonExceptionFilter } from './common/filters';
import { FileBase64, IResponse } from './common/types';
import { FileService } from './services';
import { IFileFragmentSavedRes, IFileFragmentToSaveReq } from './types';


@UseFilters(new TcpCommonExceptionFilter())
@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @MessagePattern(FILES_EVENTS.FILE_INIT_FILE_SAVING)
  public async initFileSaving(file: FileBase64): Promise<IResponse<{ sessionUUID: string }>> {
    return await this.fileService.initFileSaving(file);
  }

  @MessagePattern(FILES_EVENTS.FILE_FRAGMENT_TO_SAVE)
  public async saveFileFragment(fragment: IFileFragmentToSaveReq): Promise<IResponse<IFileFragmentSavedRes>> {
    return await this.fileService.saveFileFragment(fragment);
  }
}
