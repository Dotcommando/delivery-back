import { ICompany } from '../common/types';


export interface IUpdateCompanyReq extends Partial<Omit<ICompany, '_id'>> {
  _id: ICompany['_id'];
}
