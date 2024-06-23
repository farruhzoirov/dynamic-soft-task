import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Category } from '../entities/categories.entity';
import { Store } from '../entities/stores.entity';
import { Product } from '../entities/products.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Store, Product])],
  providers: [CategoriesService],
  controllers: [CategoriesController],
})
export class CategoriesModule {}
