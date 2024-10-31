import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { CategoriesModule } from './modules/categories/categories.module';
import { SubCategoriesModule } from './modules/subCategories/subCategories.module';
import { ProductsModule } from './modules/products/products.module';
import { OrdersService } from './modules/orders/orders.service';
import { OrderDetailsService } from './modules/orderDetails/orderDetaiils.service';
import { OrderModule } from './modules/orders/orders.module';
import { OrderDetailModule } from './modules/orderDetails/orderDetaiils.module';
import { CartModule } from './modules/cart/cart.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URL'),
        connectionFactory: (connection) => {
          connection.plugin(softDeletePlugin);
          return connection;
        },
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    AuthModule,
    CategoriesModule,
    SubCategoriesModule,
    ProductsModule,
    OrderModule,
    OrderDetailModule,
    CartModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
