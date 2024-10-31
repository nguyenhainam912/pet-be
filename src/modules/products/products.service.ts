import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Product as ProductM, ProductDocument } from './schemas/product.schema';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import { User } from 'src/decorator/customize';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { IUser } from '../users/users.interface';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(ProductM.name)
    private productModel: SoftDeleteModel<ProductDocument>,
  ) {}

  async create(createProductDto: CreateProductDto, @User() user: IUser) {
    let data = await this.productModel.create({
      ...createProductDto,
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
    const totalItems = (await this.productModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.productModel
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

  async findById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'Not found';
    return await this.productModel
      .findById({ _id: id })
      .populate({
        path: 'categoryId',
        select: 'title',
      })
      .exec();
  }

  async update(updateProductDto: UpdateProductDto, @User() user: IUser) {
    return await this.productModel.updateOne(
      { _id: updateProductDto._id },

      { updatedBy: { id: user._id, email: user.email }, ...updateProductDto },
    );
  }

  async remove(id: string, @User() user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'Not found';

    await this.productModel.updateOne(
      { _id: id },
      { deletedBy: { id: user._id, email: user.email } },
    );

    return await this.productModel.softDelete({ _id: id });
  }
}
