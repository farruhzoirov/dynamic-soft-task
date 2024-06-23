import {IsDecimal, IsNotEmpty, IsNumber, IsOptional, IsString} from 'class-validator';

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsString()
    @IsOptional()
    readonly description?: string;

    @IsNumber()
    @IsNotEmpty()
    readonly costPrice: number;

    @IsNumber()
    @IsNotEmpty()
    readonly salesPrice: number;

    @IsNumber()
    @IsNotEmpty()
    readonly amount: number;

    @IsDecimal()
    @IsNotEmpty()
    readonly discount: number;
}


export class UpdateProductDto {
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsString()
    @IsOptional()
    readonly description?: string;

    @IsNumber()
    @IsNotEmpty()
    readonly costPrice: number;

    @IsNumber()
    @IsNotEmpty()
    readonly salesPrice: number;

    @IsNumber()
    @IsNotEmpty()
    readonly amount: number;

    @IsDecimal()
    @IsNotEmpty()
    readonly discount: number;
    image: string;
}
