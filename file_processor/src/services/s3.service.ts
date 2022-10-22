import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { PutObjectCommandOutput } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { AddressedErrorCatching, ApplyAddressedErrorCatching } from '../common/decorators';


@ApplyAddressedErrorCatching
@Injectable()
export class S3Service {
  private readonly imageStorageName = this.configService.get('imageStorageName');

  constructor(
    private readonly configService: ConfigService,
    private readonly s3Client: S3Client,
  ) {
  }

  @AddressedErrorCatching()
  public async uploadFile(fileBuffer: Buffer, fileName: string, mimetype: string): Promise<PutObjectCommandOutput> {
    const uploadParams = {
      Bucket: this.imageStorageName,
      Body: fileBuffer,
      Key: fileName,
      ContentType: mimetype,
    };

    return await this.s3Client.send(new PutObjectCommand(uploadParams));
  }
}
