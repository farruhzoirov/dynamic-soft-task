import {Module, NestModule, MiddlewareConsumer} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {UsersModule} from './users/users.module';
import {ProductsModule} from './products/products.module';

import {AuthModule} from './auth/auth.module';

import {UserEntity} from './entities/users.entity';
import {Store} from './entities/stores.entity';
import {Category} from './entities/categories.entity';
import {Product} from './entities/products.entity';
import {Sale} from './entities/sales.entity';
import {Order} from './entities/orders.entity';
import {OrderItem} from './entities/order_items.entity';
import {JwtModule} from '@nestjs/jwt';
import {StoresModule} from './stores/stores.module';
import {CategoriesModule} from './categories/categories.module';
import { StatisticsModule } from './statistics/statistics.module';
import { OrdersModule } from './orders/orders.module';


import * as dotenv from 'dotenv';
import * as path from "node:path";
import * as process from "node:process";
dotenv.config();

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: process.env.DB_TYPE as any,
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT),
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            entities: [path.join(__dirname, '**', '*.entity.{ts,js}')],
            // entities: [UserEntity, Store, Category, Product, Sale, Order, OrderItem],
            synchronize: true,
        }),
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET,
            signOptions: {expiresIn: '24h'},
        }),
        UsersModule,
        ProductsModule,
        AuthModule,
        StoresModule,
        CategoriesModule,
        StatisticsModule,
        OrdersModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})

// Auth Middleware
export class AppModule {}
