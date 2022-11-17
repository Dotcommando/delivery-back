import { PickType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';

import { UpdateMultilingualFieldSetDto } from './update-multilingual-field-set.dto';

import { PartialBrandDto } from '../common/dto';
import { IUpdateBrandReq } from '../types';


export class UpdateBrandBodyDto extends PickType(
  PartialBrandDto,
  [
    'company',
    'logoLight',
    'logoDark',
    'backgroundLight',
    'backgroundDark',
    'translations',
  ] as const,
) implements Omit<IUpdateBrandReq, '_id'> {
  @ApiProperty({
    example: [
      {
        lang: 'hy',
        fullName: 'Ներողություն. Բաճկոններ տղամարդկանց համար',
        shortName: 'Ներողություն',
        title: 'Ներողություն. Բաճկոններ տղամարդկանց համար՝ կիսասեզոն և ձմեռ',
        shortDescription: 'Արդեն 17 տարի Apologet-ը ձմեռային և կիսասեզոնային բաճկոններ է կարում տղամարդկանց համար',
        description: '17 տարի շարունակ Apologet-ը կարում է ձմեռային և կիսասեզոնային բաճկոններ տղամարդկանց համար, այժմ առաքվում է շուկաների միջոցով: Առկա է բոլոր չափսերը՝ S-ից մինչև 6XL: Ոճեր՝ ռմբակոծիչներ, հողմաբաճկոններ, բաճկոններ և անձրևանոցներ:',
        keywords: 'բաճկոններ, ապոլոգետ, տղամարդկանց համար, տղամարդու, հողմաբաճկոններ, բոմբերներ, բաճկոններ, անձրևանոցներ',
        _id: '636009cdf68741824d2c69b8',
      },
      {
        lang: 'ru',
        fullName: 'Апологет. Куртки для мужчин',
        shortName: 'Апологет',
        title: 'Апологет. Куртки для мужчин: демисезонные и зимние',
        shortDescription: 'Вот уже 17 лет Апологет шьёт зимние и демисезонные куртки для мужчин',
        description: 'Вот уже 17 лет Апологет шьёт зимние и демисезонные куртки для мужчин, теперь и с доставкой через маркетплейсы! Доступна вся размерная линейка, от S размера до 6XL. Фасоны: бомберы, ветровки, дафлкоты и дождевики.',
        keywords: 'куртки, апологет, для мужчин, мужские, ветровки, бомберы, дафлкоты, дождевики',
        _id: '636009cdf68741824d2c69b9',
      },
    ],
  })
  @IsOptional()
  @IsArray({ message: 'Field \'translation\' must contain array of translations of brand data' })
  @ValidateNested({ each: true })
  @Type(() => UpdateMultilingualFieldSetDto)
  translations: UpdateMultilingualFieldSetDto[];
}
