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
import { CreateSubCategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubCategoryDto } from './dto/update-subcategory.dto';
import { SubCategoriesService } from './subCategories.service';

@Controller('subCategory')
export class SubCategoriesController {
  constructor(private readonly subCategoriesService: SubCategoriesService) {}

  @Post()
  @ResponseMessage('Create a new subcategory')
  create(@Body() createCategoryDto: CreateSubCategoryDto, @User() user: IUser) {
    return this.subCategoriesService.create(createCategoryDto, user);
  }

  @Get()
  @ResponseMessage('fetch subcategory with pageinate')
  findAllWithPage(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.subCategoriesService.findAllWithPage(+currentPage, +limit, qs);
  }

  @Put()
  @ResponseMessage('Update a subcategory')
  update(
    @Body() updateSubCategoryDto: UpdateSubCategoryDto,
    @User() user: IUser,
  ) {
    return this.subCategoriesService.update(updateSubCategoryDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete a subcategory')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.subCategoriesService.remove(id, user);
  }
}
