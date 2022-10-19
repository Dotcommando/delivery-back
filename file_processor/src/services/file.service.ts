import { HttpStatus, Injectable } from '@nestjs/common';

import * as dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';

import { StoreService } from './store.service';

import { FILE_EXTENSION_REGEXP } from '../common/constants';
import { AddressedErrorCatching, ApplyAddressedErrorCatching } from '../common/decorators';
import { FileBase64, IResponse } from '../common/types';
import { IFileFragmentSavedRes, IFileFragmentToSaveReq, IInitFileSavingReq } from '../types';


@ApplyAddressedErrorCatching
@Injectable()
export class FileService {
  constructor(
    private readonly storeService: StoreService,
  ) {
  }

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
    const nameWithoutExtension = prevName.replace(FILE_EXTENSION_REGEXP, '');
    const extension = FILE_EXTENSION_REGEXP.exec(prevName)[1];

    return `${nameWithoutExtension}-${dayjs().format('YYYY-MM-DD-HH-mm-ss-SSS')}-${sessionUUID.substring(sessionUUID.length - 6)}${Boolean(extension) ? extension : '.undf'}`;
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
    console.log('Saved symbols: ', file.buffer64.length);

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
}
