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

  constructor(
    private readonly configService: ConfigService,
    private readonly storeService: StoreService,
    private schedulerRegistry: SchedulerRegistry,
    @Inject('FILE_SERVICE') private readonly fileServiceClient: ClientProxy,
  ) {
  }

  public async saveImage(data: { file: Express.Multer.File; user?: IVendor | null }): Promise<IResponse<IImageSavingInited>> {
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

    this.initSerialTransferOfFileFragments(sessionUUID, user);

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
  private initSerialTransferOfFileFragments(sessionUUID: string, user?: IVendor | null): void {
    const schedulerJobId = this.schedulerJobPrefix + sessionUUID;

    const deleteFileInfo = async () => {
      this.clearPlannedJobs(sessionUUID);
      this.storeService.delete(sessionUUID);
    };

    const continueFileTransfer = async () => {
      const fileDataStoreResponse: IStorageData = this.storeService.get(sessionUUID);
      const fileData = fileDataStoreResponse.data as IFileDataStore;

      if (fileData.status !== FILE_TRANSFER_STATUS.COMPLETED && fileData.file.buffer64.length === 0) {
        const fileTransferCompletedResponse = await lastValueFrom(
          this.fileServiceClient.send(FILES_EVENTS.FILE_TRANSFER_COMPLETED, { sessionUUID }),
        );

        if (fileTransferCompletedResponse.status !== HttpStatus.CREATED) {
          fileData.iterations.failedAttempts += 1;
          fileData.status = FILE_TRANSFER_STATUS.TRANSFER;
          this.clearPlannedJobs(sessionUUID);

          const failedAttempt = setTimeout(continueFileTransfer, 0);

          this.schedulerRegistry.addTimeout(schedulerJobId, failedAttempt);

          return;
        }

        fileData.completed = true;
        fileData.status = FILE_TRANSFER_STATUS.COMPLETED;

        this.clearPlannedJobs(sessionUUID);
        this.storeService
          .set(sessionUUID, fileData, { ttl: this.ttlForHoldingFileSavingResult });

        return;
      }

      const encoder = new TextEncoder();
      const bytesPerSymbol: number = encoder.encode(fileData.file.buffer64.substring(0, 1)).length;
      const charsNumberInFragment = Math.floor(this.fileFragmentMaxLength / bytesPerSymbol);
      const fragmentToSend = fileData.file.buffer64.substring(0, charsNumberInFragment);

      const saveFragmentResponse: IResponse<IFileFragmentSavedRes> = await lastValueFrom(
        this.fileServiceClient.send(FILES_EVENTS.FILE_FRAGMENT_TO_SAVE, { sessionUUID, part: fragmentToSend }),
      );

      if (saveFragmentResponse.status === HttpStatus.OK) {
        fileData.iterations.failedAttempts = 0;
        fileData.file.buffer64 = fileData.file.buffer64.substring(charsNumberInFragment);
        fileData.iterations.current += 1;
        fileData.status = FILE_TRANSFER_STATUS.TRANSFER;
        this.clearPlannedJobs(sessionUUID);

        const continueSaving = setTimeout(continueFileTransfer, 0);

        this.schedulerRegistry.addTimeout(schedulerJobId, continueSaving);
      } else if (fileData.iterations.failedAttempts === this.maxFailedAttempts) {
        fileData.status = FILE_TRANSFER_STATUS.FAILED;
        fileData.completed = false;
        fileData.file.buffer64 = '';
        this.clearPlannedJobs(sessionUUID);

        const deletingAfterMaxFailedAttempts = setTimeout(deleteFileInfo, this.ttlForHoldingFileSavingResult);

        this.schedulerRegistry.addTimeout(schedulerJobId, deletingAfterMaxFailedAttempts);
      } else {
        fileData.iterations.failedAttempts += 1;
        fileData.status = FILE_TRANSFER_STATUS.TRANSFER;
        this.clearPlannedJobs(sessionUUID);

        const failedAttempt = setTimeout(continueFileTransfer, 0);

        this.schedulerRegistry.addTimeout(schedulerJobId, failedAttempt);
      }

      this.storeService.set(sessionUUID, fileData);
    };

    const continueSaving = setTimeout(continueFileTransfer, 0);
    this.schedulerRegistry.addTimeout(schedulerJobId, continueSaving);
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
