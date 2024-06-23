import {
    Controller,
    Post,
    Body,
    UseGuards,
    Req
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/order.dto';
import { AdminGuard } from '../guards/admin.guard';
import {CustomRequest} from "../interfaces/custom-request.interface";
import {CashierManagerGuard} from "../guards/cashier-manager.guard";

@Controller('orders')
@UseGuards(AdminGuard)
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    @Post('create')
    @UseGuards(CashierManagerGuard)
    async createOrder(@Body() createOrderDto: CreateOrderDto, @Req() req: CustomRequest) {
        const userId = req.user.user_id;
        return this.ordersService.createOrder(createOrderDto, userId);
    }
}
