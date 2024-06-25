import {Injectable, NotFoundException, InternalServerErrorException, HttpStatus} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/products.entity';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import * as fs from "node:fs";

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
    ) {}

    async findAll(){
        try {
            const allProducts =  await this.productRepository.find();
             return {
                 status: HttpStatus.OK,
                 message: 'All products',
                 data: allProducts
             }
        } catch (error) {
            throw new InternalServerErrorException('Error retrieving products', error.message);
        }
    }

    async findOne(id: number): Promise<Product> {
        try {
            const product = await this.productRepository.findOne({ where: { id } });
            if (!product) {
                throw new NotFoundException(`Product with ID ${id} not found`);
            }
            return product;
        } catch (error) {
            throw new InternalServerErrorException('Error retrieving product', error.message);
        }
    }

    async create(createProductDto: CreateProductDto, imagePath: string) {
        try {
            const product = this.productRepository.create({
                ...createProductDto,
                image: imagePath,
            });
             await this.productRepository.save(product);

            return  {
                statusCode: HttpStatus.CREATED,
                message: `Product was created successfully`,
            }

        } catch (error) {
            throw new InternalServerErrorException('Error creating product', error.message);
        }
    }

    async update(id: number, updateProductDto: UpdateProductDto, imagePath?: string) {
        try {
            const product = await this.findOne(id);
            if (imagePath) {
                updateProductDto.image = imagePath;
            }
            Object.assign(product, updateProductDto);
             await this.productRepository.save(product);

             return  {
                 statusCode: HttpStatus.OK,
                 message: `Product was updated successfully`,
             }

        } catch (error) {
            throw new InternalServerErrorException('Error updating product', error.message);
        }
    }

    async remove(id: number) {
        try {
            const product = await this.productRepository.findOne({ where: { id: id } });
            if (!product) {
                throw new NotFoundException(`Product with ID ${id} not found`);
            }
            if (product.image) {
                fs.unlinkSync(product.image);
            }

            await this.productRepository.remove(product);

            return {
                statusCode: HttpStatus.OK,
                message: 'Product removed successfully',
            }
        } catch (error) {
            throw new InternalServerErrorException('Error removing product', error.message);
        }
    }
}
