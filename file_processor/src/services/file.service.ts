import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';

import { S3Service } from './s3.service';
import { StoreService } from './store.service';

import { FILE_EXTENSION_REGEXP } from '../common/constants';
import { AddressedErrorCatching, ApplyAddressedErrorCatching } from '../common/decorators';
import { FileBase64, IResponse } from '../common/types';
import {
  IDeleteFileRes,
  IFileFragmentSavedRes,
  IFileFragmentToSaveReq,
  IFileTransferCompletedReq,
  IFileTransferCompletedRes,
  IGetFileLinkRes,
  IGetFileRes,
  IInitFileSavingReq,
} from '../types';


@ApplyAddressedErrorCatching
@Injectable()
export class FileService {
  constructor(
    private readonly configService: ConfigService,
    private readonly s3Service: S3Service,
    private readonly storeService: StoreService,
  ) {
  }
  private ttlAfterSaving = this.configService.get('ttlAfterSaving');

  private generateUUID(): string {
    return uuidv4();
  }

  @AddressedErrorCatching()
  public async initFileSaving(data: IInitFileSavingReq): Promise<IResponse<IFileFragmentSavedRes>> {
    const { file, user } = data;
    const sessionUUID = this.generateUUID();
    const fileName = this.generateUniqueFilename(file.originalname, sessionUUID);

    file.filename = fileName;

    const saveResponse = await this.storeService.set(sessionUUID, file);

    if (!saveResponse.done) {
      return {
        status: HttpStatus.PRECONDITION_FAILED,
        data: null,
        errors: ['Cannot init file saving'],
      };
    }

    return {
      status: HttpStatus.CREATED,
      data: { sessionUUID, fileName },
      errors: null,
    };
  }

  @AddressedErrorCatching()
  public generateUniqueFilename(prevName: string, sessionUUID): string {
    const extension = FILE_EXTENSION_REGEXP.exec(prevName)[1];
    const nameWithoutExtension = prevName.replace(extension, '');

    return `${nameWithoutExtension ? nameWithoutExtension : 'file'}-${dayjs().format('YYYY-MM-DD-HH-mm-ss-SSS')}-${sessionUUID.substring(sessionUUID.length - 6)}${Boolean(extension) ? extension : '.undf'}`;
  }

  @AddressedErrorCatching()
  public async saveFileFragment(fragment: IFileFragmentToSaveReq): Promise<IResponse<IFileFragmentSavedRes>> {
    const sessionUUID = fragment.sessionUUID;
    const noteFromStorage = this.storeService.get(sessionUUID);

    if (!noteFromStorage) {
      return {
        status: HttpStatus.PRECONDITION_FAILED,
        data: null,
        errors: [`Cannot save the fragment. Such entry in InMemory storage is absent. SessionUUID: ${sessionUUID}`],
      };
    }

    const file = noteFromStorage.data as FileBase64;

    file.buffer64 += fragment.part;
    fragment.part = '';

    const saveResponse = await this.storeService.set(sessionUUID, file);

    if (!saveResponse.done) {
      return {
        status: HttpStatus.PRECONDITION_FAILED,
        data: null,
        errors: [`Cannot save the fragment of the file. SessionUUID: ${sessionUUID}`],
      };
    }

    return {
      status: HttpStatus.OK,
      data: {
        fileName: file.filename,
        sessionUUID,
      },
      errors: null,
    };
  }

  @AddressedErrorCatching()
  public async fileTransferCompleted(data: IFileTransferCompletedReq): Promise<IResponse<IFileTransferCompletedRes>> {
    const { sessionUUID } = data;
    const noteFromStorage = this.storeService.get(sessionUUID);

    if (!noteFromStorage) {
      return {
        status: HttpStatus.PRECONDITION_FAILED,
        data: null,
        errors: [`Cannot save the fragment. Such entry in InMemory storage is absent. SessionUUID: ${sessionUUID}`],
      };
    }

    const file = noteFromStorage.data as FileBase64;
    const saveToS3Result = await this.s3Service
      .uploadFile(Buffer.from(file.buffer64, 'base64'), file.filename, file.mimetype);

    if (saveToS3Result.$metadata?.httpStatusCode !== HttpStatus.OK) {
      return {
        status: HttpStatus.PRECONDITION_FAILED,
        data: null,
        errors: [`Cannot complete file saving due to AWS error. SessionUUID: ${sessionUUID}`],
      };
    }

    this.storeService.delete(sessionUUID);

    return {
      status: HttpStatus.CREATED,
      data: { sessionUUID },
      errors: null,
    };
  }

  @AddressedErrorCatching()
  public async getFileLink(data: { fileName: string }): Promise<IResponse<IGetFileLinkRes>> {
    const { fileName } = data;
    const fileLink: string = await this.s3Service.getFileSignedUrl(fileName);

    if (!fileLink) {
      return {
        status: HttpStatus.PRECONDITION_FAILED,
        data: null,
        errors: [`Cannot get link for file ${fileName}`],
      };
    }

    return {
      status: HttpStatus.OK,
      data: {
        fileName,
        fileLink,
      },
      errors: null,
    };
  }

  @AddressedErrorCatching()
  public async getFileBuffer64(data: { fileName: string }): Promise<IResponse<IGetFileRes>> {
    const { fileName } = data;
    const getFileResponse: string = await this.s3Service.getFile(fileName);

    if (!getFileResponse) {
      return {
        status: HttpStatus.NOT_FOUND,
        data: null,
        errors: [`File ${fileName} not found`],
      };
    }

    return {
      status: HttpStatus.OK,
      data: {
        fileName,
        buffer64: getFileResponse,
      },
      errors: null,
    };
  }

  @AddressedErrorCatching()
  public async deleteFile(data: { fileName: string }): Promise<IResponse<IDeleteFileRes>> {
    const { fileName } = data;
    const deleteFileResponse = await this.s3Service.deleteFile(fileName);

    if (deleteFileResponse.$metadata?.httpStatusCode !== HttpStatus.NO_CONTENT) {
      return {
        status: HttpStatus.PRECONDITION_FAILED,
        data: null,
        errors: [`Cannot delete file ${fileName}`],
      };
    }

    return {
      status: HttpStatus.OK,
      data: { fileName },
      errors: null,
    };
  }
}
