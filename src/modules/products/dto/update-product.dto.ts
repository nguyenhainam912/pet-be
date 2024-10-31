import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateProductDto extends OmitType(CreateProductDto, [] as const) {
  @IsNotEmpty({ message: 'id khong duoc de trong' })
  _id: string;
}
