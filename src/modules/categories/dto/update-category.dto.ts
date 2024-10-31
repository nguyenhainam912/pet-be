import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateCategoryDto extends OmitType(
  CreateCategoryDto,
  [] as const,
) {
  @IsNotEmpty({ message: 'id khong duoc de trong' })
  _id: string;
}
