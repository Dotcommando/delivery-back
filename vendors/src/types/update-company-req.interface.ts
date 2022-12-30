
import { ICompany } from '../common/types';

import { UpdateCompanyBodyDto } from '../dto';


export interface IUpdateCompanyReq {
  company: UpdateCompanyBodyDto;
  _id: ICompany['_id'];
}
