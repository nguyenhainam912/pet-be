import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import mongoose, { Model } from 'mongoose';
import { User as UserM, UserDocument } from './schemas/user.schema';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from './users.interface';
import aqp from 'api-query-params';
import { User } from 'src/decorator/customize';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserM.name) private userModel: SoftDeleteModel<UserDocument>,
  ) {}

  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);

    return hash;
  };

  isValidPassword = (password: string, hash: string) => {
    return compareSync(password, hash);
  };

  async create(createUserDto: CreateUserDto, @User() user: IUser) {
    const hashPassword = this.getHashPassword(createUserDto.password);
    const isExist = await this.userModel.findOne({
      email: createUserDto.email,
    });
    if (isExist) {
      throw new BadRequestException('Email is exist');
    }

    let dataUser = await this.userModel.create({
      email: createUserDto.email,
      password: hashPassword,
      fullName: createUserDto.fullName,
      phone: createUserDto.phone,
      address: createUserDto.address,
      role: createUserDto.role ? createUserDto.role : 'USER',
      avatar: createUserDto.avatar,
      createdBy: { _id: user._id, email: user.email },
    });
    return dataUser;
  }

  async findAll() {
    const result = await this.userModel
      .find({ role: 'USER' })
      .select('fullName');
    return result;
  }

  async findAllWithPage(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.userModel
      .find(filter)
      .select('-refreshToken -password')
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

  findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'Not found';

    return this.userModel.findOne({ _id: id }).select('-password');
    // .populate({ path: 'role', select: { name: 1, _id: 1 } });
  }

  findOneByUsername(username: string) {
    return this.userModel
      .findOne({ email: username })
      .populate({ path: 'role', select: { name: 1 } });
  }

  async update(updateUserDto: UpdateUserDto, @User() user: IUser) {
    return await this.userModel.updateOne(
      { _id: updateUserDto._id },

      { updatedBy: { id: user._id, email: user.email }, ...updateUserDto },
    );
  }

  async remove(id: string, @User() user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'Not found';
    const foundUser = await this.userModel.findById(id);
    if (foundUser && foundUser.email === 'admin@gmail.com') {
      throw new BadRequestException(' k the xoa');
    }

    await this.userModel.updateOne(
      { _id: id },
      { deletedBy: { id: user._id, email: user.email } },
    );

    return await this.userModel.softDelete({ _id: id });
  }
}
