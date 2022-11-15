import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { FILES_EVENTS } from './common/constants';
import { TcpCommonExceptionFilter } from './common/filters';
import { IResponse } from './common/types';
import { FileService } from './services';
import {
  IDeleteFileRes,
  IDeleteFilesReq,
  IDeleteFilesRes,
  IFileFragmentSavedRes,
  IFileFragmentToSaveReq,
  IFileTransferCompletedReq,
  IFileTransferCompletedRes,
  IGetFileLinkRes,
  IGetFileRes,
  IInitFileSavingReq,
} from './types';


@UseFilters(new TcpCommonExceptionFilter())
@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @MessagePattern(FILES_EVENTS.FILE_INIT_FILE_SAVING)
  public async initFileSaving(data: IInitFileSavingReq): Promise<IResponse<IFileFragmentSavedRes>> {
    return await this.fileService.initFileSaving(data);
  }

  @MessagePattern(FILES_EVENTS.FILE_FRAGMENT_TO_SAVE)
  public async saveFileFragment(fragment: IFileFragmentToSaveReq): Promise<IResponse<IFileFragmentSavedRes>> {
    return await this.fileService.saveFileFragment(fragment);
  }

  @MessagePattern(FILES_EVENTS.FILE_TRANSFER_COMPLETED)
  public async fileTransferCompleted(data: IFileTransferCompletedReq): Promise<IResponse<IFileTransferCompletedRes>> {
    return await this.fileService.fileTransferCompleted(data);
  }

  @MessagePattern(FILES_EVENTS.FILE_GET_FILE_LINK)
  public async getFileLink(data: { fileName: string }): Promise<IResponse<IGetFileLinkRes>> {
    return await this.fileService.getFileLink(data);
  }

  @MessagePattern(FILES_EVENTS.FILE_GET_FILE_BUFFER64)
  public async getFileBuffer64(data: { fileName: string }): Promise<IResponse<IGetFileRes>> {
    return await this.fileService.getFileBuffer64(data);
  }

  @MessagePattern(FILES_EVENTS.FILE_DELETE_FILE)
  public async deleteFile(data: { fileName: string }): Promise<IResponse<IDeleteFileRes>> {
    return await this.fileService.deleteFile(data);
  }

  @MessagePattern(FILES_EVENTS.FILE_DELETE_FILES)
  public async deleteFiles(data: IDeleteFilesReq): Promise<IResponse<IDeleteFilesRes>> {
    return await this.fileService.deleteFiles(data);
  }
}
