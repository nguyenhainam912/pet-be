import { IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateSubCategoryDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  @IsMongoId()
  categoryId: string;
}
