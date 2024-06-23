import {
    Controller,
    Body,
    Get,
    Post,
    Param,
    Delete,
    Put,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    ParseIntPipe
} from '@nestjs/common';

import {diskStorage} from 'multer';
import {extname} from 'path';
import {ProductsService} from './products.service';
import {Product} from '../entities/products.entity';
import {AdminGuard} from '../guards/admin.guard';
import {FileInterceptor} from '@nestjs/platform-express';
import {CreateProductDto} from './dto/product.dto';
import {UpdateProductDto} from './dto/product.dto';
import {Express} from "express";
import {AdminManagerGuard} from "../guards/admin-manager.guard";

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {
    }

    @Get('all-products')
    @UseGuards(AdminGuard)
    async findAll(): Promise<Product[]> {
        return this.productsService.findAll();
    }

    @Get(':id')
    @UseGuards(AdminGuard)
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<Product> {
        return this.productsService.findOne(id);
    }

    @Post('create')
    @UseGuards(AdminManagerGuard)
    @UseInterceptors(
        FileInterceptor('image', {
            storage: diskStorage({
                destination: './images',
                filename: (req, file, cb) => {
                    const randomName = Array(32)
                        .fill(null)
                        .map(() => Math.round(Math.random() * 16).toString(16))
                        .join('');
                    cb(null, `${randomName}${extname(file.originalname)}`);
                },
            }),
        }),
    )
    async create(
        @Body() createProductDto: CreateProductDto,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<Product> {
        const imagePath = file ? file.path : null;

        return this.productsService.create(createProductDto, imagePath);
    }

    @Put(':id')
    @UseGuards(AdminGuard)
    @UseInterceptors(
        FileInterceptor('image', {
            storage: diskStorage({
                destination: './images',
                filename: (req, file, cb) => {
                    const randomName = Array(32)
                        .fill(null)
                        .map(() => Math.round(Math.random() * 16).toString(16))
                        .join('');
                    cb(null, `${randomName}${extname(file.originalname)}`);
                },
            }),
        }),
    )
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateProductDto: UpdateProductDto,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<Product> {
        const imagePath = file ? file.path : null;
        return this.productsService.update(id, updateProductDto, imagePath);
    }

    @Delete(':id')
    @UseGuards(AdminGuard)
    async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        await this.productsService.remove(id);
    }
}
