import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty } from 'class-validator';
import { CreateSubCategoryDto } from './create-subcategory.dto';

export class UpdateSubCategoryDto extends OmitType(
  CreateSubCategoryDto,
  [] as const,
) {
  @IsNotEmpty({ message: 'id khong duoc de trong' })
  _id: string;
}
