import { IBrandFiles } from './brand-files.interface';
import { ICreateBrand } from './create-brand.interface';


export interface ISaveBrandImagesReq {
  files: IBrandFiles;
  brand: ICreateBrand;
}
