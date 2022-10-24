import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  DeleteObjectCommand,
  DeleteObjectCommandOutput,
  GetObjectCommand,
  PutObjectCommand,
  PutObjectCommandOutput,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { AddressedErrorCatching, ApplyAddressedErrorCatching } from '../common/decorators';


@ApplyAddressedErrorCatching
@Injectable()
export class S3Service {
  private readonly imageStorageName = this.configService.get('imageStorageName');
  private readonly avatarStorageTime = this.configService.get('avatarStorageTime');

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

  @AddressedErrorCatching()
  public async deleteFile(fileName: string): Promise<DeleteObjectCommandOutput> {
    const deleteParams = {
      Bucket: this.imageStorageName,
      Key: fileName,
    };

    return await this.s3Client.send(new DeleteObjectCommand(deleteParams));
  }

  @AddressedErrorCatching()
  public async getFileSignedUrl(fileName: string): Promise<string> {
    const params = {
      Bucket: this.imageStorageName,
      Key: fileName,
    };

    const command = new GetObjectCommand(params);

    return await getSignedUrl(this.s3Client, command, { expiresIn: this.avatarStorageTime });
  }

  private streamToString(stream): Promise<string> {
    return new Promise((resolve, reject) => {
      const chunks = [];

      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('error', reject);
      stream.on('end', () => resolve(Buffer.concat(chunks).toString('base64')));
    });
  }

  public async getFile(fileName: string): Promise<string | null> {
    try {
      const params = {
        Bucket: this.imageStorageName,
        Key: fileName,
      };

      const data = await this.s3Client.send(new GetObjectCommand(params));

      return data
        ? await this.streamToString(data.Body)
        : null;
    } catch (e) {
      return null;
    }
  }
}
