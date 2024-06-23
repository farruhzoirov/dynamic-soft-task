import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, AddProductToCategoryDto } from './dto/category.dto';
import { AdminGuard } from '../guards/admin.guard';

@Controller('categories')

export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @UseGuards(AdminGuard)
    @Post('create')
    async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoriesService.createCategory(createCategoryDto);
    }

    @UseGuards(AdminGuard)
    @Post('add-product')
    async addProductToCategory(@Body() addProductToCategoryDto: AddProductToCategoryDto) {
        return this.categoriesService.addProductToCategory(addProductToCategoryDto);
    }
}
