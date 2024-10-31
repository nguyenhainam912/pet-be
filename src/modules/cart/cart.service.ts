import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Cart as CartM, CartDocument } from './schemas/cart.schema';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import { User } from 'src/decorator/customize';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { IUser } from '../users/users.interface';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(CartM.name)
    private cartModel: SoftDeleteModel<CartDocument>,
  ) {}

  async create(createCategoryDto: CreateCartDto, @User() user: IUser) {
    const checkCart = await this.cartModel.find({ _id: user._id });
    if (!checkCart || checkCart.length == 0) {
      let data = await this.cartModel.create({
        ...createCategoryDto,
        userId: user._id,
        createdBy: { _id: user._id, email: user.email },
      });
      return data;
    } else {
      await this.updateCart(createCategoryDto, user);
    }
  }

  async getByUserId(userId: string) {
    const result = await this.cartModel.find({ userId: userId }).populate([
      {
        path: 'detail',
        populate: [
          {
            path: 'product',
            model: 'Product',
          },
        ],
      },
    ]);
    return result;
  }

  async findAllWithPage(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.cartModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.cartModel
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

  async update(updateCategoryDto: UpdateCartDto, @User() user: IUser) {
    return await this.cartModel.updateOne(
      { _id: updateCategoryDto._id },
      { updatedBy: { id: user._id, email: user.email }, ...updateCategoryDto },
    );
  }

  async updateCart(updateCategoryDto: CreateCartDto, @User() user: IUser) {
    return await this.cartModel.updateOne(
      { userId: updateCategoryDto.userId },
      { updatedBy: { id: user._id, email: user.email }, ...updateCategoryDto },
    );
  }

  async remove(id: string, @User() user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'Not found';

    await this.cartModel.updateOne(
      { _id: id },
      { deletedBy: { id: user._id, email: user.email } },
    );

    return await this.cartModel.softDelete({ _id: id });
  }
}
