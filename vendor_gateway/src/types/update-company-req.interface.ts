import { ICompany } from '../common/types';


export interface IUpdateCompanyReq extends Omit<ICompany, 'emailConfirmed' | 'phoneConfirmed'> {
}
