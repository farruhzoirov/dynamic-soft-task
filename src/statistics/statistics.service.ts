import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import {Store} from '../entities/stores.entity';

import {Category} from '../entities/categories.entity';
import {UserEntity} from '../entities/users.entity';
import {Sale} from "../entities/sales.entity";

@Injectable()
export class StatisticsService {
    constructor(
        @InjectRepository(Store)
        private readonly storeRepository: Repository<Store>,
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(Sale)
        private readonly saleRepository: Repository<Sale>,
    ) {
    }

    async getAdminStoresWithCategoryCount(adminId: number): Promise<any> {
        const stores = await this.storeRepository.find({
            where: {admin_id: adminId},
            relations: ['categories'],
        });

        const result = stores.map(store => ({
            storeId: store.id,
            storeName: store.name,
            categoryCount: store.categories.length,
        }));

        return result;
    }


    async getAdminProductsWithCount(adminId: number): Promise<any> {
        const stores = await this.storeRepository.find({
            where: {admin_id: adminId},
            relations: ['categories', 'categories.products'],
        });

        const products = stores.flatMap(store => store.categories.flatMap(category => category.products));

        return {
            productCount: products.length,
            products: products.map(product => ({
                id: product.id,
                name: product.name,
                description: product.description,
                costPrice: product.costPrice,
                salesPrice: product.salePrice,
                amount: product.amount,
                discount: product.discount,
                imagePath: product.image,
            })),
        };
    }



    async getDailySales(adminId: number, startDate?: , endDate?: Date): Promise<any> {
        const stores = await this.storeRepository.find({
            where: {admin_id: adminId},
            relations: ['categories', 'categories.products'],
        });

        const storeIds = stores.map(store => store.id);

        let salesQuery = this.saleRepository.createQueryBuilder('sale')
            .innerJoin('sale.product', 'product')
            .innerJoin('product.category', 'category')
            .innerJoin('category.store', 'store')
            .where('store.id IN (:...storeIds)', {storeIds});

        if (startDate && endDate) {
            salesQuery = salesQuery.andWhere('sale.saleDate BETWEEN :startDate AND :endDate', {startDate, endDate});
        }

        const sales = await salesQuery.getMany();

        const dailySales = sales.reduce((acc, sale) => {
            const date = sale.saleDate.toISOString().split('T')[0];
            if (!acc[date]) {
                acc[date] = {
                    cash: 0,
                    card: 0,
                    total: 0,
                };
            }
            acc[date][sale.paymentMethod] += sale.totalPrice;
            acc[date].total += sale.totalPrice;
            return acc;
        }, {});

        return dailySales;
    }
}
