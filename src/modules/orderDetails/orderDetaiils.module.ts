import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderDetail, OrderDetailSchema } from './schemas/orderDetail.schema';
import { OrderDetailsController } from './orderDetaiils.controller';
import { OrderDetailsService } from './orderDetaiils.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OrderDetail.name, schema: OrderDetailSchema },
    ]),
  ],
  controllers: [OrderDetailsController],
  providers: [OrderDetailsService],
  exports: [OrderDetailsService],
})
export class OrderDetailModule {}
