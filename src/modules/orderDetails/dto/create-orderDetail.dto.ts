import { IsNotEmpty } from 'class-validator';

export class CreateOrderDetailDto {
  @IsNotEmpty()
  orderId: string;

  @IsNotEmpty()
  productId: string;

  @IsNotEmpty()
  quantity: Number;
}
