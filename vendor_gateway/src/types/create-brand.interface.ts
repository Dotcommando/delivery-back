import { IBrand } from '../common/types';


export interface ICreateBrand extends Omit<IBrand, 'logoLight' | 'logoDark' | 'backgroundLight' | 'backgroundDark'> {
  logoLight: [Express.Multer.File];
  logoDark: [Express.Multer.File];
  backgroundLight: [Express.Multer.File];
  backgroundDark: [Express.Multer.File];
}
