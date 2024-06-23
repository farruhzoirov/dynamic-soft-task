import {Controller, Post, Get, Body, UseGuards, Request} from '@nestjs/common';
import {SuperAdminGuard} from '../guards/super-admin.guard';
import {StoresService} from './stores.service'
import {CreateStoreDto} from "./dto/store.dto";
import {Roles} from "../decarators/roles.decorator";

@Controller('stores')
export class StoresController {
    constructor(private readonly storesService: StoresService) {}

    @Post('create')
    @UseGuards( SuperAdminGuard)
    createStore(@Body() createStoreDto: CreateStoreDto) {
        return this.storesService.createStore(createStoreDto);
    }

    @Get('statistics')
    @UseGuards(SuperAdminGuard)
    getStoreStatistics() {
        return this.storesService.getStoreStatistics();
    }
}
