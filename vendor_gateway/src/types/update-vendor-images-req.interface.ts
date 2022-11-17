import { IVendor } from '../common/types';


export interface IUpdateVendorImagesReq {
  avatar: Express.Multer.File | null;
  user: IVendor;
}
