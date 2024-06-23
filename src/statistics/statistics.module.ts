import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import {Store} from "../entities/stores.entity";
import {Category} from "../entities/categories.entity";
import {UserEntity} from "../entities/users.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Sale} from "../entities/sales.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Store, Category, UserEntity, Sale])],
  providers: [StatisticsService],
  controllers: [StatisticsController]
})
export class StatisticsModule {}
