import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/categories.entity';
import { CreateCategoryDto, AddProductToCategoryDto } from './dto/category.dto';
import { Store } from '../entities/stores.entity';
import { Product } from '../entities/products.entity';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
        @InjectRepository(Store)
        private readonly storeRepository: Repository<Store>,
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
    ) {}

    async createCategory(createCategoryDto: CreateCategoryDto): Promise<Category> {
        try {
            const { name, storeId } = createCategoryDto;
            const store = await this.storeRepository.findOne({ where: { id: storeId } });
            if (!store) {
                throw new NotFoundException('Store not found');
            }

            const category = this.categoryRepository.create({
                name,
                store: store,
            });

            return await this.categoryRepository.save(category);
        } catch (error) {
            throw new InternalServerErrorException('Error creating category', error.message);
        }
    }

    async addProductToCategory(addProductToCategoryDto: AddProductToCategoryDto): Promise<Category> {
        try {
            const { categoryId, productId } = addProductToCategoryDto;
            const category = await this.categoryRepository.findOne({ where: { id: categoryId }, relations: ['products'] });
            const product = await this.productRepository.findOne({ where: { id: productId } });

            if (!category) {
                throw new NotFoundException('Category not found');
            }
            if (!product) {
                throw new NotFoundException('Product not found');
            }

            category.products.push(product);

            return await this.categoryRepository.save(category);
        } catch (error) {
            throw new InternalServerErrorException('Error adding product to category', error.message);
        }
    }
}
