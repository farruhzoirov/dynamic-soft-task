import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Sale } from '../entities/sales.entity';
import { UserEntity } from '../entities/users.entity';
import { Product } from '../entities/products.entity';
import { Order } from '../entities/orders.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import {OrderItem} from "../entities/order_items.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Sale, Product, UserEntity])
  ],
  controllers: [OrdersController],
  providers: [OrdersService]
})
export class OrdersModule {}
