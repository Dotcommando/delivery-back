import { IImageSavingInited } from './image-saving-inited.interface';

import { IAddress, IVendor } from '../common/types';


export interface IUpdateVendorRes {
  user: IVendor<IAddress>;
  fileData?: IImageSavingInited;
}
