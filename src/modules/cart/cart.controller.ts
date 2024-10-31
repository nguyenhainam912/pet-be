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
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { CartService } from './cart.service';

@Controller('cart')
export class CartControllers {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @ResponseMessage('Create a new cart')
  create(@Body() createCategoryDto: CreateCartDto, @User() user: IUser) {
    return this.cartService.create(createCategoryDto, user);
  }

  @Get()
  @ResponseMessage('fetch cart with pageinate')
  findAllWithPage(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.cartService.findAllWithPage(+currentPage, +limit, qs);
  }

  @Get('/byUser')
  @ResponseMessage('fetch cart by user')
  findByUser(@Query('userId') userId: string) {
    return this.cartService.getByUserId(userId);
  }

  @Put()
  @ResponseMessage('Update a cart')
  update(@Body() updateCategoryDto: UpdateCartDto, @User() user: IUser) {
    return this.cartService.update(updateCategoryDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete a cart')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.cartService.remove(id, user);
  }
}
