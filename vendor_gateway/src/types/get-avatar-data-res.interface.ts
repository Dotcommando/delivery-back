import { FILE_TRANSFER_STATUS } from '../constants';


export interface IGetAvatarDataRes {
  fileName: string;
  fileLink: string;
  sessionUUID: string;
  status: FILE_TRANSFER_STATUS;
}
