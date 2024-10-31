import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import {
  OrderDetail as OrderDetailM,
  OrderDetailDocument,
} from './schemas/orderDetail.schema';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import { User } from 'src/decorator/customize';
import { CreateOrderDetailDto } from './dto/create-orderDetail.dto';
import { UpdateOrderDetailDto } from './dto/update-orderDetail.dto';
import { IUser } from '../users/users.interface';

@Injectable()
export class OrderDetailsService {
  constructor(
    @InjectModel(OrderDetailM.name)
    private orderDetailModel: SoftDeleteModel<OrderDetailDocument>,
  ) {}

  async create(createCategoryDto: CreateOrderDetailDto, @User() user: IUser) {
    let data = await this.orderDetailModel.create({
      ...createCategoryDto,
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
    const totalItems = (await this.orderDetailModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.orderDetailModel
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

  async update(updateCategoryDto: UpdateOrderDetailDto, @User() user: IUser) {
    console.log(updateCategoryDto);
    return await this.orderDetailModel.updateOne(
      { _id: updateCategoryDto._id },

      { updatedBy: { id: user._id, email: user.email }, ...updateCategoryDto },
    );
  }

  async remove(id: string, @User() user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'Not found';

    await this.orderDetailModel.updateOne(
      { _id: id },
      { deletedBy: { id: user._id, email: user.email } },
    );

    return await this.orderDetailModel.softDelete({ _id: id });
  }
}
