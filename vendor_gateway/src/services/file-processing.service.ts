import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { SchedulerRegistry } from '@nestjs/schedule';

import { lastValueFrom } from 'rxjs';

import { TextEncoder } from 'util';

import { StoreService } from './store.service';

import { FileBase64Class } from '../common/classes';
import { FILES_EVENTS } from '../common/constants';
import { AddressedErrorCatching, ApplyAddressedErrorCatching } from '../common/decorators';
import { FileBase64, IResponse, IStorageData, IVendor } from '../common/types';
import { FILE_TRANSFER_STATUS } from '../constants';
import { IFileDataStore, IFileFragmentSavedRes, IImageSavingInited } from '../types';


@ApplyAddressedErrorCatching
@Injectable()
export class FileProcessingService {
  private schedulerJobPrefix = 'file-processing-';
  private defaultTTL: number = this.configService.get('ttl');
  private ttlForHoldingFileSavingResult: number = this.configService.get('ttlForHoldingFileSavingResult');
  private fileFragmentMaxLength: number = this.configService.get('fileFragmentMaxLength');
  private maxFailedAttempts: number = this.configService.get('maxFailedAttempts');
  private bytesPerSymbol = 1;

  constructor(
    private readonly configService: ConfigService,
    private readonly storeService: StoreService,
    private schedulerRegistry: SchedulerRegistry,
    @Inject('FILE_SERVICE') private readonly fileServiceClient: ClientProxy,
  ) {
  }

  private calculateBytesPerSymbol(fileBase64: FileBase64): void {
    const encoder = new TextEncoder();
    this.bytesPerSymbol = encoder.encode(fileBase64.buffer64.substring(0, 1)).length;
  }

  public async saveImage(
    data: { file: Express.Multer.File; user?: IVendor | null },
    onCompleteFn?: (filename: string, ...args: unknown[]) => Promise<unknown>,
  ): Promise<IResponse<IImageSavingInited>> {
    const file: Express.Multer.File = data.file;
    const user = data.user;
    const fileBase64: FileBase64 = new FileBase64Class(file);
    const fileInitSavingResponse: IResponse<IFileFragmentSavedRes> = await lastValueFrom(
      this.fileServiceClient
        .send(FILES_EVENTS.FILE_INIT_FILE_SAVING, {
          file: { ...fileBase64, buffer64: '' },
          user,
        }),
    );

    if (fileInitSavingResponse.status !== HttpStatus.CREATED) {
      return {
        status: fileInitSavingResponse.status,
        data: null,
        errors: [
          ...(Array.isArray(fileInitSavingResponse.errors) ? [...fileInitSavingResponse.errors] : []),
          'Cannot init saving of the image',
        ],
      };
    }

    this.calculateBytesPerSymbol(fileBase64);

    const fileName = fileInitSavingResponse.data.fileName;
    const fileDataToStore: IFileDataStore = {
      file: fileBase64,
      fileName,
      ...(Boolean(user) && { userId: user._id }),
      iterations: {
        total: Math.ceil(fileBase64.buffer64.length / this.fileFragmentMaxLength),
        current: 0,
        failedAttempts: 0,
      },
      completed: false,
      status: FILE_TRANSFER_STATUS.PENDING,
    };

    const sessionUUID = fileInitSavingResponse.data.sessionUUID;
    const saveResponse = this.storeService.set(sessionUUID, fileDataToStore);

    if (!saveResponse.done) {
      return {
        status: HttpStatus.PRECONDITION_FAILED,
        data: null,
        errors: [
          'Cannot set file to gateway in-memory storage',
        ],
      };
    }

    Boolean(onCompleteFn)
      ? this.initSerialTransferOfFileFragments(sessionUUID, onCompleteFn)
      : this.initSerialTransferOfFileFragments(sessionUUID);

    return {
      status: HttpStatus.OK,
      data: {
        sessionUUID,
        fileName,
      },
      errors: null,
    };
  }

  @AddressedErrorCatching()
  private initSerialTransferOfFileFragments(
    sessionUUID: string,
    onCompleteFn?: (filename: string, ...args: unknown[]) => Promise<unknown>,
  ): void {
    const schedulerJobId = this.schedulerJobPrefix + sessionUUID;

    const continueFileTransfer = async () => {
      const fileDataStoreResponse: IStorageData = this.storeService.get(sessionUUID);
      const fileData = fileDataStoreResponse.data as IFileDataStore;

      if (fileData.status !== FILE_TRANSFER_STATUS.COMPLETED && fileData.file.buffer64.length === 0) {
        await this.completeFileTransfer(sessionUUID, continueFileTransfer, onCompleteFn);

        return;
      }

      const charsNumberInFragment = Math.floor(this.fileFragmentMaxLength / this.bytesPerSymbol);
      const fragmentToSend = fileData.file.buffer64.substring(0, charsNumberInFragment);
      const saveFragmentResponse: IResponse<IFileFragmentSavedRes> = await lastValueFrom(
        this.fileServiceClient.send(FILES_EVENTS.FILE_FRAGMENT_TO_SAVE, { sessionUUID, part: fragmentToSend }),
      );

      if (saveFragmentResponse.status === HttpStatus.OK) {
        this.commitSuccessAndContinue(fileData, sessionUUID, schedulerJobId, charsNumberInFragment, continueFileTransfer);
      } else if (fileData.iterations.failedAttempts === this.maxFailedAttempts) {
        this.commitFailAndStop(fileData, sessionUUID, schedulerJobId);
      } else {
        this.commitFailAndContinue(fileData, sessionUUID, schedulerJobId, continueFileTransfer);
      }

      this.storeService.set(sessionUUID, fileData);
    };

    const continueSaving = setTimeout(continueFileTransfer, 0);
    this.schedulerRegistry.addTimeout(schedulerJobId, continueSaving);
  }

  private commitSuccessAndContinue(
    fileData: IFileDataStore,
    sessionUUID: string,
    schedulerJobId: string,
    charsNumberInFragment: number,
    fnContinue: () => void,
  ): void {
    fileData.iterations.failedAttempts = 0;
    fileData.file.buffer64 = fileData.file.buffer64.substring(charsNumberInFragment);
    fileData.iterations.current += 1;
    fileData.status = FILE_TRANSFER_STATUS.TRANSFER;
    this.clearPlannedJobs(sessionUUID);

    const continueSaving = setTimeout(fnContinue, 0);

    this.schedulerRegistry.addTimeout(schedulerJobId, continueSaving);
  }

  private commitFailAndStop(
    fileData: IFileDataStore,
    sessionUUID: string,
    schedulerJobId: string,
  ): void {
    fileData.status = FILE_TRANSFER_STATUS.FAILED;
    fileData.completed = false;
    fileData.file.buffer64 = '';
    this.clearPlannedJobs(sessionUUID);

    const deletingAfterMaxFailedAttempts = setTimeout(
      () => this.deleteFileInfo(sessionUUID),
      this.ttlForHoldingFileSavingResult,
    );

    this.schedulerRegistry.addTimeout(schedulerJobId, deletingAfterMaxFailedAttempts);
  }

  private commitFailAndContinue(
    fileData: IFileDataStore,
    sessionUUID: string,
    schedulerJobId: string,
    fnContinue: () => void,
  ): void {
    fileData.iterations.failedAttempts += 1;
    fileData.status = FILE_TRANSFER_STATUS.TRANSFER;
    this.clearPlannedJobs(sessionUUID);

    const failedAttempt = setTimeout(fnContinue, 0);

    this.schedulerRegistry.addTimeout(schedulerJobId, failedAttempt);
  }

  @AddressedErrorCatching()
  private async completeFileTransfer(
    sessionUUID: string,
    fnContinue: () => void,
    onCompleteFn: (fileName: string) => void,
  ): Promise<void> {
    const fileDataStoreResponse: IStorageData = this.storeService.get(sessionUUID);
    const fileData = fileDataStoreResponse.data as IFileDataStore;
    const schedulerJobId = this.schedulerJobPrefix + sessionUUID;

    const fileTransferCompletedResponse = await lastValueFrom(
      this.fileServiceClient.send(FILES_EVENTS.FILE_TRANSFER_COMPLETED, { sessionUUID }),
    );

    if (fileTransferCompletedResponse.status !== HttpStatus.CREATED) {
      fileData.iterations.failedAttempts += 1;
      fileData.status = FILE_TRANSFER_STATUS.TRANSFER;
      this.clearPlannedJobs(sessionUUID);

      const failedAttempt = setTimeout(fnContinue, 0);

      this.schedulerRegistry.addTimeout(schedulerJobId, failedAttempt);

      return;
    }

    fileData.completed = true;
    fileData.status = FILE_TRANSFER_STATUS.COMPLETED;

    this.clearPlannedJobs(sessionUUID);
    this.storeService
      .set(sessionUUID, fileData, { ttl: this.ttlForHoldingFileSavingResult });
    onCompleteFn(fileData.fileName);

    return;
  }

  private deleteFileInfo(sessionUUID: string): void {
    this.clearPlannedJobs(sessionUUID);
    this.storeService.delete(sessionUUID);
  }

  private clearPlannedJobs(id: string): void {
    const schedulerJobId = this.schedulerJobPrefix + id;

    if (this.schedulerRegistry.doesExist('timeout', schedulerJobId)) {
      this.schedulerRegistry.deleteTimeout(schedulerJobId);
    }

    if (this.schedulerRegistry.doesExist('interval', schedulerJobId)) {
      this.schedulerRegistry.deleteInterval(schedulerJobId);
    }

    if (this.schedulerRegistry.doesExist('cron', schedulerJobId)) {
      this.schedulerRegistry.deleteCronJob(schedulerJobId);
    }
  }

  public getStorageNote(sessionUUID: string): IStorageData {
    return this.storeService.get(sessionUUID);
  }
}
