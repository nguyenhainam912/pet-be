import { IsArray, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class CreateOrderDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  totalPrice: string;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  pay: string;

  @IsArray()
  detail: [
    {
      quantity: number;
      productId: mongoose.Schema.Types.ObjectId;
    },
  ];
}
