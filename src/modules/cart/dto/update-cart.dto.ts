import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateCartDto } from './create-cart.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateCartDto extends OmitType(CreateCartDto, [] as const) {
  @IsNotEmpty({ message: 'id khong duoc de trong' })
  _id: string;
}
