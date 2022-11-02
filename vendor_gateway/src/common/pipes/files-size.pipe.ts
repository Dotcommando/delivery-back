import { FileValidator } from '@nestjs/common';


export interface IFileSize { [fieldName: string]: number }

export class FilesSizePipe extends FileValidator {
  private sizes: IFileSize[];
  private fileNameWithExceededSize: string;
  private fieldNameWithExceededSize: string;
  private maxSize: number;

  constructor(options: { sizes: IFileSize[] }) {
    super(options);

    this.sizes = [...options.sizes];
  }

  public isValid(data?: { [fieldName: string]: Express.Multer.File[] }): boolean {
    for (let i = 0; i < this.sizes.length; i++) {
      const fieldName = Object.keys(this.sizes[i])[0];

      for (const key in data) {
        if (key !== fieldName) continue;

        for (let j = 0; j < data[key].length; j++) {
          if (data[key][j].size > this.sizes[i][fieldName]) {
            this.fileNameWithExceededSize = data[key][j].originalname;
            this.fieldNameWithExceededSize = fieldName;
            this.maxSize = this.sizes[i][fieldName];

            return false;
          }
        }
      }
    }

    return true;
  }

  public buildErrorMessage(data?: { [fieldName: string]: Express.Multer.File[] }[]): string {
    return `File ${this.fileNameWithExceededSize} in field \'${this.fieldNameWithExceededSize}\' exceeds max file size which is ${Math.floor(this.maxSize / 1024)} Kb`;
  }
}
