import { IAddress, ICompany } from '../common/types';


export interface ICreateCompanyRes {
  company: ICompany<string, IAddress<string, string>, string>;
}
