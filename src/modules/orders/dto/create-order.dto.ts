import { IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  totalPrice: string;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  address: string;
}
