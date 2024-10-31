import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateOrderDto extends OmitType(CreateOrderDto, [] as const) {
  @IsNotEmpty({ message: 'id khong duoc de trong' })
  _id: string;
}
