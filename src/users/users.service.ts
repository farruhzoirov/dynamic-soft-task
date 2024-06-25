import { ConflictException, Injectable, InternalServerErrorException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/users.entity';
import * as bcrypt from 'bcryptjs';

import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>,
    ) {}

    async findOneById(id: number): Promise<UserEntity | undefined> {
        try {
            return await this.userRepo.findOne({ where: { id } });
        } catch (error) {
            throw new InternalServerErrorException('Error finding user by ID', error.message);
        }
    }

    async createAdmin(userDto: UserDto): Promise<any> {
        try {
            const { username, password } = userDto;

            const existingAdmin = await this.userRepo.findOne({ where: { username } });
            if (existingAdmin) {
                throw new ConflictException('Admin already taken');
            }

            const hashedPassword = await bcrypt.hash(password, 12);
            const admin = this.userRepo.create({
                username,
                password: hashedPassword,
                role: 'admin',
            });
            const savedAdmin = await this.userRepo.save(admin);
            return {
                statusCode: HttpStatus.CREATED,
                message: 'Admin created successfully',
                data: savedAdmin,
            };
        } catch (error) {
            if (error instanceof ConflictException) {
                throw error;
            }
            throw new InternalServerErrorException('Error creating admin', error.message);
        }
    }

    async createManager(userDto: UserDto): Promise<any> {
        try {
            const { username, password } = userDto;

            const existingManager = await this.userRepo.findOne({ where: { username } });
            if (existingManager) {
                throw new ConflictException('Manager already taken');
            }

            const hashedPassword = await bcrypt.hash(password, 12);
            const manager = this.userRepo.create({
                username,
                password: hashedPassword,
                role: 'manager',
            });
            const savedManager = await this.userRepo.save(manager);
            return {
                statusCode: HttpStatus.CREATED,
                message: 'Manager created successfully',
                data: savedManager,
            };
        } catch (error) {
            if (error instanceof ConflictException) {
                throw error;
            }
            throw new InternalServerErrorException('Error creating manager', error.message);
        }
    }

    async createCashier(userDto: UserDto): Promise<any> {
        try {
            const { username, password } = userDto;

            const existingCashier = await this.userRepo.findOne({ where: { username } });
            if (existingCashier) {
                throw new ConflictException('Cashier already taken');
            }

            const hashedPassword = await bcrypt.hash(password, 12);
            const cashier = this.userRepo.create({
                username,
                password: hashedPassword,
                role: 'cashier',
            });
            const savedCashier = await this.userRepo.save(cashier);
            return {
                statusCode: HttpStatus.CREATED,
                message: 'Cashier created successfully',
                data: savedCashier,
            };
        } catch (error) {
            if (error instanceof ConflictException) {
                throw error;
            }
            throw new InternalServerErrorException('Error creating cashier', error.message);
        }
    }
}
