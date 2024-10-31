import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';
import mongoose from 'mongoose';

export class CreateCartDto {
  @IsOptional()
  userId: string;

  @IsOptional()
  totalPrice: string;

  @IsOptional()
  @IsArray()
  detail: {
    quantity: number;
    product: mongoose.Schema.Types.ObjectId;
  };
}
