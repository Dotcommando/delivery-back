import { FileValidator, Injectable } from '@nestjs/common';

import fileType from 'file-type';

import { MIME_TYPES, MIME_TYPES_ARRAY } from '../constants';
import { IFileTypeOptions } from '../types';


@Injectable()
export class FileTypePipe extends FileValidator<IFileTypeOptions> {
  protected readonly validationOptions: { acceptableTypes: MIME_TYPES[] } = {
    acceptableTypes: [ MIME_TYPES.JPG, MIME_TYPES.PNG, MIME_TYPES.GIF ],
  };

  constructor(options: IFileTypeOptions) {
    super(options);

    if (!options || (!Array.isArray(options.acceptableTypes) && typeof options.acceptableTypes !== 'string')) {
      throw new Error('Format of MIME types passed to File Type Validator is unreadable');
    }

    const acceptableTypes = Array.isArray(options.acceptableTypes)
      ? options.acceptableTypes
      : [options.acceptableTypes];

    for (let i = 0; i < acceptableTypes.length; i++) {
      if (!MIME_TYPES_ARRAY.includes(acceptableTypes[i])) {
        throw new Error('Unknown MIME type passed to File Type Validator');
      }
    }

    this.validationOptions.acceptableTypes = acceptableTypes;
  }

  public buildErrorMessage(file: Express.Multer.File): string {
    return `Actual file '${file.originalname}' has unacceptable MIME type. List of acceptable types: ${this.validationOptions.acceptableTypes.join(', ')}.`;
  }

  public async isValid(file?: Express.Multer.File): Promise<boolean> {
    const actualMimeType = fileType(file.buffer)?.mime;

    return this.validationOptions.acceptableTypes.includes(actualMimeType as unknown as MIME_TYPES);
  }
}
