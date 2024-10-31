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
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrdersService } from './orders.service';

@Controller('order')
export class OrdersControllers {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ResponseMessage('Create a new order')
  create(@Body() createCategoryDto: CreateOrderDto, @User() user: IUser) {
    return this.ordersService.create(createCategoryDto, user);
  }

  @Get()
  @ResponseMessage('fetch order with pageinate')
  findAllWithPage(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.ordersService.findAllWithPage(+currentPage, +limit, qs);
  }

  @Put()
  @ResponseMessage('Update a order')
  update(@Body() updateCategoryDto: UpdateOrderDto, @User() user: IUser) {
    return this.ordersService.update(updateCategoryDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete a order')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.ordersService.remove(id, user);
  }
}
