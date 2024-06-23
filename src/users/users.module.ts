import {Module} from '@nestjs/common';
import {UsersController} from './users.controller';
import {UsersService} from './users.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "../entities/users.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
    ],
    exports: [UsersService],
    controllers: [UsersController],
    providers: [UsersService]
})

export class UsersModule {}
