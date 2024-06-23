import { IsArray, IsNotEmpty, IsString } from 'class-validator';

class CreateOrderItemDto {
    @IsNotEmpty()
    productId: number;

    @IsNotEmpty()
    quantity: number;

    @IsNotEmpty()
    discount: number;
}

export class CreateOrderDto {
    @IsArray()
    @IsNotEmpty()
    items: CreateOrderItemDto[];

    @IsString()
    @IsNotEmpty()
    paymentMethod: string;
}
