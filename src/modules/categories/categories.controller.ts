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
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoriesService } from './categories.service';

@Controller('category')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ResponseMessage('Create a new category')
  create(@Body() createCategoryDto: CreateCategoryDto, @User() user: IUser) {
    return this.categoriesService.create(createCategoryDto, user);
  }

  @Get()
  @ResponseMessage('fetch category with pageinate')
  findAllWithPage(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.categoriesService.findAllWithPage(+currentPage, +limit, qs);
  }

  @Public()
  @Get('/catalog')
  @ResponseMessage('fetch get catalog')
  getCatalog() {
    return this.categoriesService.getCatalog();
  }

  @Put()
  @ResponseMessage('Update a User')
  update(@Body() updateCategoryDto: UpdateCategoryDto, @User() user: IUser) {
    return this.categoriesService.update(updateCategoryDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete a User')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.categoriesService.remove(id, user);
  }
}
