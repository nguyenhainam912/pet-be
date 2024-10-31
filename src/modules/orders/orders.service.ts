import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Order as OrderM, OrderDocument } from './schemas/order.schema';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import { User } from 'src/decorator/customize';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { IUser } from '../users/users.interface';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(OrderM.name)
    private orderModel: SoftDeleteModel<OrderDocument>,
  ) {}

  async create(createCategoryDto: CreateOrderDto, @User() user: IUser) {
    let data = await this.orderModel.create({
      ...createCategoryDto,
      userId: user._id,
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
    const totalItems = (await this.orderModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.orderModel
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

  async update(updateCategoryDto: UpdateOrderDto, @User() user: IUser) {
    return await this.orderModel.updateOne(
      { _id: updateCategoryDto._id },
      { updatedBy: { id: user._id, email: user.email }, ...updateCategoryDto },
    );
  }

  async remove(id: string, @User() user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'Not found';

    await this.orderModel.updateOne(
      { _id: id },
      { deletedBy: { id: user._id, email: user.email } },
    );

    return await this.orderModel.softDelete({ _id: id });
  }
}
