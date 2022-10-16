import { MIME_TYPES } from '../constants';


export interface IFileTypeValidatorOptions {
  acceptableTypes: MIME_TYPES | MIME_TYPES[];
}
