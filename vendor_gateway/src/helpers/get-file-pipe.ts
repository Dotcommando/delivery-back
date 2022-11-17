import { ParseFilePipe } from '@nestjs/common';

import { BRAND_BGRD_SIZE, BRAND_LOGO_SIZE, MIME_TYPES } from '../common/constants';
import { FilesSizePipe, FilesTypePipe } from '../common/pipes';


export function getFilePipe(): ParseFilePipe {
  return new ParseFilePipe({
    validators: [
      new FilesSizePipe({
        sizes: [
          { logoLight: BRAND_LOGO_SIZE },
          { logoDark: BRAND_LOGO_SIZE },
          { backgroundLight: BRAND_BGRD_SIZE },
          { backgroundDark: BRAND_BGRD_SIZE },
        ],
      }),
      new FilesTypePipe({
        types: [
          { logoLight: [ MIME_TYPES.JPG, MIME_TYPES.PNG, MIME_TYPES.GIF ]},
          { logoDark: [ MIME_TYPES.JPG, MIME_TYPES.PNG, MIME_TYPES.GIF ]},
          { backgroundLight: [ MIME_TYPES.JPG, MIME_TYPES.PNG, MIME_TYPES.GIF ]},
          { backgroundDark: [ MIME_TYPES.JPG, MIME_TYPES.PNG, MIME_TYPES.GIF ]},
        ],
      }),
    ],
    fileIsRequired: false,
  });
}
