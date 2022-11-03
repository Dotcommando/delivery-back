import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { lastValueFrom, timeout } from 'rxjs';

import { FileProcessingService } from './file-processing.service';

import { FILES_EVENTS, MAX_TIME_OF_REQUEST_WAITING, VENDORS_EVENTS } from '../common/constants';
import { AddressedErrorCatching, ApplyAddressedErrorCatching } from '../common/decorators';
import { IBrand, IResponse } from '../common/types';
import { ICreateBrandRes, IImageSavingInited, ISaveBrandImagesReq, ISaveBrandImagesRes } from '../types';


@ApplyAddressedErrorCatching
@Injectable()
export class BrandsService {
  constructor(
    private readonly fileProcessingService: FileProcessingService,
    @Inject('VENDOR_SERVICE') private readonly vendorServiceClient: ClientProxy,
    @Inject('FILE_SERVICE') private readonly fileServiceClient: ClientProxy,
  ) {
  }

  @AddressedErrorCatching()
  public async createBrand(body: IBrand): Promise<IResponse<ICreateBrandRes>> {
    return await lastValueFrom(
      this.vendorServiceClient
        .send(VENDORS_EVENTS.VENDOR_CREATE_BRAND, body)
        .pipe(timeout(MAX_TIME_OF_REQUEST_WAITING)),
    );
  }

  @AddressedErrorCatching()
  public async saveBrandImages(data: ISaveBrandImagesReq): Promise<IResponse<ISaveBrandImagesRes>> {
    const { brand, files } = data;
    const imagesData: ISaveBrandImagesRes = {};
    const promisesArray: Promise<IResponse<IImageSavingInited>>[] = [];
    const fileFields = [];
    const fileNames = [];

    for (const fieldName in files) {
      fileFields.push(fieldName);
      fileNames.push(data.files[fieldName]?.[0]?.originalname);
      promisesArray.push(this.fileProcessingService
        .saveImage(
          { file: files[fieldName as string][0] as Express.Multer.File },
          this.changeBrandImage({ brand, fieldName }),
        ),
      );
    }

    const imageSaveInitResponse: PromiseSettledResult<IResponse<IImageSavingInited>>[] = await Promise.allSettled(promisesArray);
    const saveResults = [];

    for (let i = 0; i < fileFields.length; i++) {
      saveResults.push(
        imageSaveInitResponse[i].status === 'fulfilled'
        && (imageSaveInitResponse[i] as PromiseFulfilledResult<IResponse<IImageSavingInited>>).value?.status >= 200
        && (imageSaveInitResponse[i] as PromiseFulfilledResult<IResponse<IImageSavingInited>>).value?.status < 300,
      );

      imagesData[fileFields[i]] = imageSaveInitResponse[i].status === 'fulfilled'
        ? (imageSaveInitResponse[i] as PromiseFulfilledResult<IResponse<IImageSavingInited>>).value.data
        : { fileName: fileNames[i], sessionUUID: null };
    }

    const allFailed = saveResults.every(result => result === false);

    return allFailed
      ? {
        status: HttpStatus.PRECONDITION_FAILED,
        data: null,
        errors: ['All attempts to save images for all images failed'],
      }
      : {
        status: HttpStatus.OK,
        data: imagesData,
        errors: null,
      };
  }

  private changeBrandImage({ brand, fieldName }: { brand: IBrand; fieldName: string }): { (fileName: string): Promise<void> } {
    return async (fileName: string): Promise<void> => {
      try {
        if (Boolean(brand[fieldName])) {
          const deleteOldFieldFromAWSResponse = await lastValueFrom(
            this.fileServiceClient.send(FILES_EVENTS.FILE_DELETE_FILE, { fileName: brand[fieldName] }),
          );
        }

        const updateBrandResponse = await lastValueFrom(
          this.vendorServiceClient.send(VENDORS_EVENTS.VENDOR_UPDATE_BRAND, {
            _id: brand._id,
            [fieldName]: fileName,
          }),
        );

        return;
      } catch (e) {
      }
    };
  }
}
