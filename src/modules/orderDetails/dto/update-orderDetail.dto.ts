import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateOrderDetailDto } from './create-orderDetail.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateOrderDetailDto extends OmitType(
  CreateOrderDetailDto,
  [] as const,
) {
  @IsNotEmpty({ message: 'id khong duoc de trong' })
  _id: string;
}
