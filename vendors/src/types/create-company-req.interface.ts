import { ICompany } from '../common/types';


export interface ICreateCompanyReq extends Omit<ICompany, 'emailConfirmed' | 'phoneConfirmed'> {
}
