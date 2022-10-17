import { FileBase64 } from '../types';


export class FileBase64Class implements FileBase64  {
  public fieldname: string;
  public originalname: string;
  public encoding: string;
  public mimetype: string;
  public size: number;
  public filename: string;
  public path: string;
  public buffer64: string;

  constructor(file: Express.Multer.File) {
    this.fieldname = file.fieldname;
    this.originalname = file.originalname;
    this.encoding = file.encoding;
    this.mimetype = file.mimetype;
    this.size = file.size;
    this.filename = file.filename;
    this.path = file.path;
    this.buffer64 = file.buffer.toString('base64');
  }
}
