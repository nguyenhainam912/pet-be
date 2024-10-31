import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import {
  Category as CategoryM,
  CategoryDocument,
} from './schemas/category.schema';
import {
  SubCategory as SubCategoryM,
  SubCategoryDocument,
} from '../subCategories/schemas/subCategory.schema';
import {
  Product as ProductM,
  ProductDocument,
} from '../products/schemas/product.schema';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import { User } from 'src/decorator/customize';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { IUser } from '../users/users.interface';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(CategoryM.name)
    private categoryModel: SoftDeleteModel<CategoryDocument>,
    @InjectModel(SubCategoryM.name)
    private subCategoryModel: SoftDeleteModel<SubCategoryDocument>,
    @InjectModel(ProductM.name)
    private productModel: SoftDeleteModel<ProductDocument>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto, @User() user: IUser) {
    let data = await this.categoryModel.create({
      title: createCategoryDto.title,
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
    const totalItems = (await this.categoryModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.categoryModel
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

  // async getCatalog() {
  //   try {
  //     let catalog = [];
  //     const categories = await this.categoryModel.find();

  //     catalog = categories.map(async (cate) => {
  //       let catalog1 = [];
  //       let obj: {
  //         categoryId: string;
  //         title: string;
  //         subCategory: { subCategoryId: string; title: string }[];
  //       } = {
  //         categoryId: cate._id.toString(),
  //         title: cate.title,
  //         subCategory: [],
  //       };

  //       const subcates = await this.subCategoryModel.find({
  //         categoryId: cate._id,
  //       });

  //       subcates.map((subcate) => {
  //         let subObj: { subCategoryId: string; title: string } = {
  //           subCategoryId: subcate._id.toString(),
  //           title: subcate.title,
  //         };

  //         obj.subCategory.push(subObj);
  //       });
  //       catalog1.push(obj);
  //       console.log(catalog1);
  //     });
  //     console.log(catalog);

  //     return catalog;
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }

  getCatalog() {
    return new Promise(async (resolve, reject) => {
      let catalog = [];
      const categories = await this.categoryModel.find();

      for (const cate of categories) {
        let obj: {
          categoryId: string;
          title: string;
          count: number;
          subCategory: {
            subCategoryId: string;
            title: string;
            count: number;
          }[];
        } = {
          categoryId: cate._id.toString(),
          title: cate.title,
          count: 0,
          subCategory: [],
        };

        try {
          const subcates = await this.subCategoryModel.find({
            categoryId: cate._id,
          });

          obj.subCategory = await Promise.all(
            subcates.map(async (subcate) => {
              const pro = await this.productModel.find({
                subCategoryId: subcate._id,
              });
              obj.count += pro.length;
              return {
                subCategoryId: subcate._id.toString(),
                title: subcate.title,
                count: pro.length,
              };
            }),
          );
        } catch (error) {
          reject(error);
        }

        catalog.push(obj);
      }

      resolve(catalog);
    });
  }

  async update(updateCategoryDto: UpdateCategoryDto, @User() user: IUser) {
    console.log(updateCategoryDto);
    return await this.categoryModel.updateOne(
      { _id: updateCategoryDto._id },

      { updatedBy: { id: user._id, email: user.email }, ...updateCategoryDto },
    );
  }

  async remove(id: string, @User() user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'Not found';

    await this.categoryModel.updateOne(
      { _id: id },
      { deletedBy: { id: user._id, email: user.email } },
    );

    return await this.categoryModel.softDelete({ _id: id });
  }
}
