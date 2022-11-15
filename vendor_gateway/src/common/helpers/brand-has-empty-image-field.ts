import { IMAGE_FIELDS } from '../../constants';
import { IUpdateBrandReq } from '../../types';
import { IBrand } from '../types';


export function brandHasEmptyImageField(brand: IBrand | IUpdateBrandReq): boolean {
  for (const key of IMAGE_FIELDS) {
    if (!(key in brand)) {
      continue;
    }

    if (brand[key] === '' || brand[key] === null) {
      return true;
    }
  }

  return false;
}
