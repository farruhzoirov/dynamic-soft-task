import {IsDateString, IsNotEmpty, } from 'class-validator'


export class DateRangeDto {
    @IsNotEmpty()
    @IsDateString()
    startDate?: string;

    @IsNotEmpty()
    @IsDateString()
    endDate?: string;
}