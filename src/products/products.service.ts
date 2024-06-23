import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/products.entity';
import { CreateProductDto } from './dto/product.dto';
import { UpdateProductDto } from './dto/product.dto';
import * as fs from "node:fs";

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
    ) {
    }

    async findAll(): Promise<Product[]> {
        return this.productRepository.find();
    }

    async findOne(id: number): Promise<Product> {
        const product = await this.productRepository.findOne({where: {id}});
        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
        return product;
    }

    async create(createProductDto: CreateProductDto, imagePath: string): Promise<Product> {
        const product = this.productRepository.create({
            ...createProductDto,
            image: imagePath,
        });
        return this.productRepository.save(product);
    }

    async update(id: number, updateProductDto: UpdateProductDto, imagePath?: string): Promise<Product> {
        const product = await this.findOne(id);
        if (imagePath) {
            updateProductDto.image = imagePath;
        }
        Object.assign(product, updateProductDto);
        return this.productRepository.save(product);
    }

    async remove(id: number): Promise<void> {
        const product = await this.productRepository.findOne({where: {id: id}});
        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
        if (product.image) {
            fs.unlinkSync(product.image);
        }

        await this.productRepository.remove(product);
    }
}