import {ConflictException, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {UserEntity} from '../entities/users.entity';
import * as bcrypt from 'bcryptjs';

import {UserDto} from "./dto/user.dto";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>,
    ) {
    }

    async findOneById(id: number): Promise<UserEntity | undefined> {
        return this.userRepo.findOne({ where: { id } });
    }

    async createAdmin(userDto: UserDto): Promise<UserEntity> {

        const {username, password} = userDto;


        const existingAdmin = await this.userRepo.findOne({where: {username}});
        if (existingAdmin) {
            throw new ConflictException('Admin already taken');
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const admin = this.userRepo.create({
            username,
            password: hashedPassword,
            role: 'admin',
        });
        return this.userRepo.save(admin);
    }


    async createManager(userDto: UserDto): Promise<UserEntity> {
        const {username, password} = userDto;

        const existingAdmin = await this.userRepo.findOne({where: {username}});
        if (existingAdmin) {
            throw new ConflictException('Manager already taken');
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const manager = this.userRepo.create({
            username,
            password: hashedPassword,
            role: 'manager',
        });
        return this.userRepo.save(manager);
    }

    async createCashier(userDto: UserDto): Promise<UserEntity> {
        const {username, password} = userDto;

        const existingAdmin = await this.userRepo.findOne({where: {username}});
        if (existingAdmin) {
            throw new ConflictException('Cashier already taken');
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const cashier = this.userRepo.create({
            username,
            password: hashedPassword,
            role: 'cashier',
        });
        return this.userRepo.save(cashier);
    }
}
