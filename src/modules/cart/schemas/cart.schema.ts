import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/decorator/customize';

export type CartDocument = HydratedDocument<Cart>;

@Schema({ timestamps: true })
export class Cart {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  totalPrice: Number;

  @Prop({ type: Array })
  detail: {
    product: {
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

export const CartSchema = SchemaFactory.createForClass(Cart);
