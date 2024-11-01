import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/decorator/customize';

export type OrderDocument = HydratedDocument<Order>;

enum PaymentMethod {
  TM = 'TM',
  CK = 'CK',
}

@Schema({ timestamps: true })
export class Order {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  totalPrice: number;

  @Prop({ required: true })
  phone: String;

  @Prop({ required: true })
  address: String;

  @Prop({ required: true })
  pay: PaymentMethod;

  @Prop({ type: Array })
  detail: {
    productId: {
      type: mongoose.Schema.Types.ObjectId;
      ref: 'Product';
    };
    quantity: number;
  };

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

export const OrderSchema = SchemaFactory.createForClass(Order);
