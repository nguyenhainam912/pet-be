import { IsEmpty, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  categoryId: string;

  @IsOptional()
  subCategoryId: string;

  @IsOptional()
  code: string;

  @IsOptional()
  image: string;

  @IsOptional()
  tag: string;

  @IsOptional()
  quantity: number;

  @IsNotEmpty()
  price: number;
}
