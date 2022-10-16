import { ArgumentMetadata, FileValidator, Injectable, PipeTransform } from '@nestjs/common';


@Injectable()
export class FileSizeValidationPipe extends FileValidator<{ maxFileSize: number }> implements PipeTransform {
  // Size in bytes
  protected readonly validationOptions: { maxFileSize: number } = { maxFileSize: Number(process.env.AVATAR_FILE_SIZE) * 1024 };

  constructor(options?: { maxFileSize: number }) {
    super(options);

    if (typeof options?.maxFileSize === 'number' && !isNaN(options?.maxFileSize)) {
      this.validationOptions.maxFileSize = options.maxFileSize;
    }
  }

  public transform(value: any, metadata: ArgumentMetadata) {
    return value.size < this.validationOptions.maxFileSize;
  }

  public buildErrorMessage(file: Express.Multer.File): string {
    return `File size must be less than ${Math.floor(this.validationOptions.maxFileSize / 1024)} bytes. Actual size of '${file.originalname} is ${Math.ceil(file.size / 1024)} KBytes.' `;
  }

  public isValid(file?: Express.Multer.File): boolean | Promise<boolean> {
    const actualFileSize = file.buffer.length;

    return actualFileSize < this.validationOptions.maxFileSize;
  }
}
