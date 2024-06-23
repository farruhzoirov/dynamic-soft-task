import {Controller, Get, UseGuards, Req, Query} from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import {AdminGuard} from "../guards/admin.guard";



@Controller('statistics')
export class StatisticsController {
    constructor(private readonly statisticsService: StatisticsService) {}

    @Get('admin-stores')
    @UseGuards(AdminGuard)
    async getAdminStoresWithCategoryCount(@Req() req: any) {
        const user = req.user;
        return this.statisticsService.getAdminStoresWithCategoryCount(user.user_id);
    }

    @Get('admin-products')
    @UseGuards(AdminGuard)
    async getAdminProductsWithCount(@Req() req: any) {
        const user = req.user;
        return this.statisticsService.getAdminProductsWithCount(user.user_id);
    }

    @Get('daily-sales')
    @UseGuards(AdminGuard)
    async getDailySales(
        @Req() req: any,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ) {
        const user = req.user;
        const start = startDate ? new Date(startDate) : undefined;
        const end = endDate ? new Date(endDate) : undefined;
        return this.statisticsService.getDailySales(user.user_id, start, end);
    }
}
