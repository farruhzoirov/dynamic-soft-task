import {IsNotEmpty, IsNumber, IsString} from 'class-validator'


export class CreateStoreDto {
    @IsNotEmpty()
    @IsString()
    name: string;


    @IsNotEmpty()
    @IsNumber()
    adminId: number;
}