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
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@Controller('product')
export class CategoriesController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ResponseMessage('Create a new product')
  create(@Body() createProductDto: CreateProductDto, @User() user: IUser) {
    return this.productsService.create(createProductDto, user);
  }

  @Get()
  @Public()
  @ResponseMessage('fetch product with pageinate')
  findAllWithPage(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.productsService.findAllWithPage(+currentPage, +limit, qs);
  }

  @Get('/byId')
  @Public()
  @ResponseMessage('fetch product by id')
  findById(@Query('id') id: string) {
    return this.productsService.findById(id);
  }

  @Patch()
  @ResponseMessage('Update a product')
  update(@Body() updateCategoryDto: UpdateProductDto, @User() user: IUser) {
    return this.productsService.update(updateCategoryDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete a product')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.productsService.remove(id, user);
  }
}
