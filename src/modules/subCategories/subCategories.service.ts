import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import {
  SubCategory as SubCategoryM,
  SubCategoryDocument,
} from './schemas/subCategory.schema';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import { User } from 'src/decorator/customize';
import { CreateSubCategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubCategoryDto } from './dto/update-subcategory.dto';
import { IUser } from '../users/users.interface';

@Injectable()
export class SubCategoriesService {
  constructor(
    @InjectModel(SubCategoryM.name)
    private subCategoryModel: SoftDeleteModel<SubCategoryDocument>,
  ) {}

  async create(createCategoryDto: CreateSubCategoryDto, @User() user: IUser) {
    let data = await this.subCategoryModel.create({
      title: createCategoryDto.title,
      categoryId: createCategoryDto.categoryId,
      createdBy: { _id: user._id, email: user.email },
    });
    return data;
  }

  async findAllWithPage(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.subCategoryModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.subCategoryModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .exec();
    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems, // tổng số phần tử (số bản ghi)
      },
      result, //kết quả query
    };
  }

  async update(
    updateSubCategoryDto: UpdateSubCategoryDto,
    @User() user: IUser,
  ) {
    return await this.subCategoryModel.updateOne(
      { _id: updateSubCategoryDto._id },

      {
        updatedBy: { id: user._id, email: user.email },
        ...updateSubCategoryDto,
      },
    );
  }

  async remove(id: string, @User() user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'Not found';

    await this.subCategoryModel.updateOne(
      { _id: id },
      { deletedBy: { id: user._id, email: user.email } },
    );

    return await this.subCategoryModel.softDelete({ _id: id });
  }
}
