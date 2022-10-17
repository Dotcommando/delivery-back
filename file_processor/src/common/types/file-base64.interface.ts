export interface FileBase64 extends Omit<Express.Multer.File, 'stream' | 'destination' | 'buffer'> {
  buffer64: string;
}
