import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Order } from 'src/modules/orders/schemas/order.schema';
import { Product } from 'src/modules/products/schemas/product.schema';

export type OrderDetailDocument = HydratedDocument<OrderDetail>;

@Schema({ timestamps: true })
export class OrderDetail {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Order.name,
    required: true,
  })
  orderId: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Product.name,
    required: true,
  })
  productId: mongoose.Schema.Types.ObjectId;

  @Prop()
  quantity: number;

  @Prop({ type: Object })
  createdBy: { _id: mongoose.Schema.Types.ObjectId; email: string };

  @Prop({ type: Object })
  updatedBy: { _id: mongoose.Schema.Types.ObjectId; email: string };

  @Prop({ type: Object })
  deletedBy: { _id: mongoose.Schema.Types.ObjectId; email: string };

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  deletedAt: Date;

  @Prop()
  isDeleted: boolean;
}

export const OrderDetailSchema = SchemaFactory.createForClass(OrderDetail);
