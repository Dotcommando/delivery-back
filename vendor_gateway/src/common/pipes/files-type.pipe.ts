import { FileValidator } from '@nestjs/common';

import fileType from 'file-type';

import { MIME_TYPES } from '../constants';


export interface IFileType { [fieldName: string]: MIME_TYPES[] }

export class FilesTypePipe extends FileValidator {
  private types: IFileType[];
  private fileNameWithWrongMimeType: string;
  private fieldNameWithWrongMimeType: string;
  private acceptableTypes: MIME_TYPES[];
  private actualMimeType: MIME_TYPES;

  constructor(options: { types: IFileType[] }) {
    super(options);

    this.types = [...options.types];
  }

  public isValid(data?: { [fieldName: string]: Express.Multer.File[] }): boolean {
    for (let i = 0; i < this.types.length; i++) {
      const fieldName = Object.keys(this.types[i])[0];

      for (const key in data) {
        if (key !== fieldName) continue;

        for (let j = 0; j < data[key].length; j++) {
          const actualMimeType = fileType(data[key][j].buffer)?.mime;

          if (!this.types[i][fieldName].includes(actualMimeType as MIME_TYPES)) {
            this.fileNameWithWrongMimeType = data[key][j].originalname;
            this.fieldNameWithWrongMimeType = fieldName;
            this.acceptableTypes = this.types[i][fieldName];
            this.actualMimeType = actualMimeType as MIME_TYPES;

            return false;
          }
        }
      }
    }

    return true;
  }

  public buildErrorMessage(data?: { [fieldName: string]: Express.Multer.File[] }[]): string {
    return `File ${this.fileNameWithWrongMimeType} in field \'${this.fieldNameWithWrongMimeType}\' has MIME type ${this.actualMimeType}, while the following types are valid: ${this.acceptableTypes.join(', ')}.`;
  }
}
