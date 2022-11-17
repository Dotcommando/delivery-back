import { MulterField } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';


export function getFileInterceptorSettings(): MulterField[] {
  return [
    { name: 'logoLight', maxCount: 1 },
    { name: 'logoDark', maxCount: 1 },
    { name: 'backgroundLight', maxCount: 1 },
    { name: 'backgroundDark', maxCount: 1 },
  ];
}
