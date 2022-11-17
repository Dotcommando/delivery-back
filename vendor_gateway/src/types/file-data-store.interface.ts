import { FileBase64 } from '../common/types';
import { FILE_TRANSFER_STATUS } from '../constants';


export interface IFileDataStore {
  file: FileBase64;
  fileName: string;
  iterations: {
    total: number;
    current: number;
    failedAttempts: number;
  };
  completed: boolean;
  status: FILE_TRANSFER_STATUS;
}
