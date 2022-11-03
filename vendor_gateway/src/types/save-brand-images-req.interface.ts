import { IBrand } from '../common/types';


export interface ISaveBrandImagesReq {
  files: { [fieldName: string]: [Express.Multer.File] };
  brand: IBrand;
}
