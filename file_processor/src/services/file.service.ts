import { HttpStatus, Injectable } from '@nestjs/common';

import { v4 as uuidv4 } from 'uuid';

import { StoreService } from './store.service';

import { AddressedErrorCatching, ApplyAddressedErrorCatching } from '../common/decorators';
import { FileBase64, IResponse } from '../common/types';
import { IFileFragmentSavedRes, IFileFragmentToSaveReq } from '../types';


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
  public async initFileSaving(file: FileBase64): Promise<IResponse<{ sessionUUID: string }>> {
    const sessionUUID = this.generateUUID();
    const saveResponse = await this.storeService.set(sessionUUID, file);

    if (!saveResponse.done) {
      return {
        status: HttpStatus.PRECONDITION_FAILED,
        data: null,
        errors: ['Cannot init file saving'],
      };
    }

    console.log(' ');
    console.log('saveResponse');
    console.log(saveResponse);

    return {
      status: HttpStatus.CREATED,
      data: { sessionUUID },
      errors: null,
    };
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
        saved: true,
        sessionUUID,
      },
      errors: null,
    };
  }
}
