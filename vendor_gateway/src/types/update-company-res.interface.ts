import { IAddress, ICompany } from '../common/types';


export interface IUpdateCompanyRes {
  company: ICompany<string, IAddress<string, string>, string>;
}
