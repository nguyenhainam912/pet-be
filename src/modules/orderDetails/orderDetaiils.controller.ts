import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Put,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from '../users/users.interface';
import { CreateOrderDetailDto } from './dto/create-orderDetail.dto';
import { UpdateOrderDetailDto } from './dto/update-orderDetail.dto';
import { OrderDetailsService } from './orderDetaiils.service';

@Controller('orderDetail')
export class OrderDetailsController {
  constructor(private readonly orderDetailsService: OrderDetailsService) {}

  @Post()
  @ResponseMessage('Create a new orderDetail')
  create(@Body() createCategoryDto: CreateOrderDetailDto, @User() user: IUser) {
    return this.orderDetailsService.create(createCategoryDto, user);
  }

  @Get()
  @ResponseMessage('fetch orderDetail with pageinate')
  findAllWithPage(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.orderDetailsService.findAllWithPage(+currentPage, +limit, qs);
  }

  @Put()
  @ResponseMessage('Update a orderDetail')
  update(@Body() updateCategoryDto: UpdateOrderDetailDto, @User() user: IUser) {
    return this.orderDetailsService.update(updateCategoryDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete a orderDetail')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.orderDetailsService.remove(id, user);
  }
}
