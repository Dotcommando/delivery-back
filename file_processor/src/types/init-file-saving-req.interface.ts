import { FileBase64, IBasicUserData } from '../common/types';


export interface IInitFileSavingReq {
  file: FileBase64;
  user: IBasicUserData;
}
