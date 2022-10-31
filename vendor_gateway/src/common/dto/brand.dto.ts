import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

import { Transform, Type } from 'class-transformer';
import { IsArray, IsDefined, IsOptional, MaxLength, ValidateNested } from 'class-validator';
import { Types } from 'mongoose';

import { BrandMultilingualFieldSetDto } from './brand-multilingual-field-set.dto';

import { IMAGE_ADDRESS_MAX_LENGTH } from '../constants';
import { toObjectId } from '../helpers';


export class BrandBodyDto {
  @ApiProperty({
    description: 'It matches \'_id\' from collection \'brands\' from DB. Valid MongoDB compatible ObjectId',
    required: true,
    example: '62a584a2f2fdd2cf95548236',
  })
  @IsDefined()
  @Transform(toObjectId)
  @Type(() => Types.ObjectId)
  _id: Types.ObjectId;

  @ApiProperty({
    description: 'It matches \'_id\' from collection \'companies\' from DB. Valid MongoDB compatible ObjectId',
    required: true,
    example: '62a584a2f2fdd2cf95548236',
  })
  @IsDefined()
  @Transform(toObjectId)
  @Type(() => Types.ObjectId)
  company: Types.ObjectId;

  @ApiProperty({
    description: 'Filename with extension',
    example: 'light-background-2022-10-24-12-53-04-097-9800fc.jpg',
  })
  @IsOptional()
  @MaxLength(IMAGE_ADDRESS_MAX_LENGTH, {
    message: `Light background filename length must be equal or shorter ${IMAGE_ADDRESS_MAX_LENGTH} characters`,
  })
  backgroundLight: string;

  @ApiProperty({
    description: 'Filename with extension',
    example: 'dark-background-2022-10-24-12-53-04-097-9800fc.jpg',
  })
  @IsOptional()
  @MaxLength(IMAGE_ADDRESS_MAX_LENGTH, {
    message: `Dark background filename length must be equal or shorter ${IMAGE_ADDRESS_MAX_LENGTH} characters`,
  })
  backgroundDark: string;

  @ApiProperty({
    description: 'Filename with extension',
    example: 'logo-2022-10-24-12-53-04-097-9800fc.jpg',
  })
  @IsOptional()
  @MaxLength(IMAGE_ADDRESS_MAX_LENGTH, {
    message: `Logotype filename length must be equal or shorter ${IMAGE_ADDRESS_MAX_LENGTH} characters`,
  })
  logo: string;

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
  @Type(() => BrandMultilingualFieldSetDto)
  translations: BrandMultilingualFieldSetDto[];
}

export class PartialBrandDto extends PartialType(BrandBodyDto) {}
