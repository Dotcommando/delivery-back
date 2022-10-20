import { FILE_TRANSFER_STATUS } from '../constants';


export interface IGetAvatarDataRes {
  fileName: string;
  sessionUUID: string;
  status: FILE_TRANSFER_STATUS;
}
