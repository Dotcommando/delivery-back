import { IBrand, IUpdateBrandMultilingualFieldSet } from '../common/types';


export interface IUpdateBrandReq extends Omit<IBrand, 'company' | 'logo'> {
  company?: IBrand['company'];
  logoLight?: IBrand['logoLight'] | null;
  logoDark?: IBrand['logoDark'] | null;
  backgroundLight?: IBrand['backgroundLight'] | null;
  backgroundDark?: IBrand['backgroundDark'] | null;
  translations: IUpdateBrandMultilingualFieldSet[];
}
