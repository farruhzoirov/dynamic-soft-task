import {Controller, Post, Body, UseGuards} from '@nestjs/common';
import {UsersService} from './users.service';
import {SuperAdminGuard} from '../guards/super-admin.guard';

import {UserDto} from "./dto/user.dto";
import {AdminGuard} from "../guards/admin.guard";

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {
    }

    @Post('create-admin')
    @UseGuards(SuperAdminGuard)
    async createAdmin(
        @Body() userDto: UserDto,
    ) {
        return this.usersService.createAdmin(userDto);
    }

    @Post('create-manager')
    @UseGuards(AdminGuard)
    async createManager(
        @Body() userDto: UserDto,
    ) {
        return this.usersService.createManager(userDto);
    }

    @Post('create-cashier')
    @UseGuards(AdminGuard)
    async createCashier(
        @Body() userDto: UserDto,
    ) {
        return this.usersService.createCashier(userDto);
    }
}
