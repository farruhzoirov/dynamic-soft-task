import {IsNotEmpty, IsNumber, IsString} from 'class-validator'


export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsNumber()
    @IsNotEmpty()
    readonly storeId: number;
}

export class AddProductToCategoryDto {
    @IsNumber()
    @IsNotEmpty()
    readonly productId: number;

    @IsNumber()
    @IsNotEmpty()
    readonly categoryId: number;
}
