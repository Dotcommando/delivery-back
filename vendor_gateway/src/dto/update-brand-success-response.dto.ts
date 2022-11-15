import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { IBrand, IResponse } from '../common/types';
import { IUpdateBrandRes } from '../types';


export class UpdateBrandSuccessResponseDto implements IResponse<IUpdateBrandRes> {
  @ApiProperty({ example: HttpStatus.OK })
  status: HttpStatus | number;

  @ApiProperty({
    example: {
      brand: {
        _id: '636500810ef4509a4e4eaff9',
        company: '634549e0871ea8d4a5e8480b',
        translations: [
          {
            lang: 'ru',
            fullName: 'Апологет. Куртки для мужчин',
            shortName: 'Апологет',
            title: 'Апологет. Куртки для мужчин: демисезонные и зимние',
            shortDescription: 'Вот уже 17 лет Апологет шьёт зимние и демисезонные куртки для мужчин',
            description: 'Вот уже 17 лет Апологет шьёт зимние и демисезонные куртки для мужчин, теперь и с доставкой через маркетплейсы! Доступна вся размерная линейка, от S размера до 6XL. Фасоны: бомберы, ветровки, дафлкоты и дождевики.',
            keywords: 'куртки, апологет, для мужчин, мужские, ветровки, бомберы, дафлкоты, дождевики',
          },
          {
            lang: 'hy',
            fullName: 'Ներողություն. Բաճկոններ տղամարդկանց համար',
            shortName: 'Ներողություն',
            title: 'Ներողություն. Բաճկոններ տղամարդկանց համար՝ կիսասեզոն և ձմեռ',
            shortDescription: 'Արդեն 17 տարի Apologet-ը ձմեռային և կիսասեզոնային բաճկոններ է կարում տղամարդկանց համար',
            description: '17 տարի շարունակ Apologet-ը կարում է ձմեռային և կիսասեզոնային բաճկոններ տղամարդկանց համար, այժմ առաքվում է շուկաների միջոցով: Առկա է բոլոր չափսերը՝ S-ից մինչև 6XL: Ոճեր՝ ռմբակոծիչներ, հողմաբաճկոններ, բաճկոններ և անձրևանոցներ:',
            keywords: 'բաճկոններ, ապոլոգետ, տղամարդկանց համար, տղամարդու, հողմաբաճկոններ, բոմբերներ, բաճկոններ, անձրևանոցներ',
          },
        ],
      },
      backgroundLight: {
        sessionUUID: 'df7a9462-298b-41ab-ad31-6d2dffeda6d9',
        fileName: 'IMG_1737-2022-11-10-08-26-09-521-eda6d9.jpeg',
      },
      backgroundDark: {
        sessionUUID: '9edd7df5-3b91-43eb-9a8e-8645e3226828',
        fileName: 'IMG_1729-2022-11-10-08-26-09-532-226828.jpeg',
      },
      logoLight: {
        sessionUUID: 'b7f986cb-25a9-4ec4-80f3-9acd09f2878a',
        fileName: 'IMG_1725-2022-11-10-08-26-09-532-f2878a.jpeg',
      },
    },
  })
  data: {
    brand: IBrand<string, string>;
  } | null;

  @ApiProperty({ example: null, nullable: true })
  errors: string[] | null;
}
