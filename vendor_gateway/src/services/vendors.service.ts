import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { lastValueFrom, map, timeout } from 'rxjs';

import { FileProcessingService } from './file-processing.service';

import { MAX_TIME_OF_REQUEST_WAITING, VENDORS_EVENTS } from '../common/constants';
import { AddressedErrorCatching, ApplyAddressedErrorCatching } from '../common/decorators';
import { IAddress, IResponse, IStorageData, IVendor } from '../common/types';
import { FILE_TRANSFER_STATUS } from '../constants';
import {
  IDeleteVendorData,
  IFileDataStore,
  IGetAvatarDataRes,
  IImageSavingInited,
  ILogoutRes,
  IUpdateVendorData,
  IUpdateVendorRes,
} from '../types';


@ApplyAddressedErrorCatching
@Injectable()
export class VendorsService {
  constructor(
    private readonly fileProcessingService: FileProcessingService,
    @Inject('VENDOR_SERVICE') private readonly vendorServiceClient: ClientProxy,
  ) {
  }

  public async updateVendor(data: IUpdateVendorData): Promise<IResponse<IUpdateVendorRes>> {
    let fileData: IImageSavingInited;

    if ('avatar' in data) {
      const imageSavingInitedResponse: IResponse<IImageSavingInited> = await this.fileProcessingService
        .saveImage({ file: data.avatar as Express.Multer.File, user: data.user });

      data.avatar = null;

      if (imageSavingInitedResponse.status !== HttpStatus.OK) {
        return {
          status: HttpStatus.PRECONDITION_FAILED,
          data: null,
          errors: [
            ...(Array.isArray(imageSavingInitedResponse.errors) ? imageSavingInitedResponse.errors : []),
            'Cannot save avatar file',
          ],
        };
      }

      fileData = imageSavingInitedResponse.data;
    }

    if ((!data.body.email && !data.body.phoneNumber) || !Boolean(data.user)) {
      return await lastValueFrom(
        this.vendorServiceClient
          .send(VENDORS_EVENTS.VENDOR_UPDATE_VENDOR, { ...data.body, _id: data._id })
          .pipe(
            timeout(MAX_TIME_OF_REQUEST_WAITING),
            map((response: IResponse<{ user: IVendor<IAddress> }>) => ({
              ...response,
              data: Boolean(response.data)
                ? {
                  user: response.data.user,
                  ...(Boolean(fileData) && { fileData }),
                } as IUpdateVendorRes
                : null,
            })),
          ),
      );
    }

    const { body, _id, user } = data;
    const bodyUpdated = { ...body };

    if (bodyUpdated.phoneNumber === user.phoneNumber) {
      delete bodyUpdated.phoneNumber;
    }

    if (bodyUpdated.email === user.email) {
      delete bodyUpdated.email;
    }

    return await lastValueFrom(
      this.vendorServiceClient
        .send(VENDORS_EVENTS.VENDOR_UPDATE_VENDOR, { ...bodyUpdated, _id })
        .pipe(
          timeout(MAX_TIME_OF_REQUEST_WAITING),
          map((response: IResponse<{ user: IVendor<IAddress> }>) => ({
            ...response,
            data: Boolean(response.data)
              ? {
                user: response.data.user,
                ...(Boolean(fileData) && { fileData }),
              } as IUpdateVendorRes
              : null,
          })),
        ),
    );
  }

  public async deleteUser(data: IDeleteVendorData): Promise<IResponse<ILogoutRes>> {
    const { _id, user } = data;

    if (!user || String(user._id) !== String(user._id)) {
      return {
        status: HttpStatus.BAD_REQUEST,
        data: null,
        errors: ['Defined id parameter does not match user id'],
      };
    }

    return await lastValueFrom(
      this.vendorServiceClient
        .send(VENDORS_EVENTS.VENDOR_DELETE_USER, { _id })
        .pipe(timeout(MAX_TIME_OF_REQUEST_WAITING)),
    );
  }

  @AddressedErrorCatching()
  public async getAvatarData(sessionUUID: string): Promise<IResponse<IGetAvatarDataRes>> {
    const fileData: IStorageData = this.fileProcessingService.getStorageNote(sessionUUID);

    if (!fileData.data) {
      return {
        status: HttpStatus.NOT_FOUND,
        data: null,
        errors: [`No entries with UUID ${sessionUUID} found`],
      };
    }

    const data = fileData.data as IFileDataStore;

    if (data?.status !== FILE_TRANSFER_STATUS.FAILED && data?.status !== FILE_TRANSFER_STATUS.COMPLETED) {
      return {
        status: HttpStatus.ACCEPTED,
        data: {
          fileName: data.fileName,
          sessionUUID,
          status: data.status,
        },
        errors: null,
      };
    }

    return {
      status: HttpStatus.OK,
      data: {
        fileName: data.fileName,
        sessionUUID,
        status: data.status,
      },
      errors: null,
    };
  }
}
