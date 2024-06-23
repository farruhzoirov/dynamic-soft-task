import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UserEntity } from '../entities/users.entity';
import * as bcrypt from 'bcryptjs';
import { AuthDto } from './dto/auth.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>,
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    async register(authDto: AuthDto) {
        const { username, password } = authDto;

        const existingUser = await this.userRepo.findOne({ where: { username } });
        if (existingUser) {
            return { message: 'Username already taken' };
        }

        const hashPass = await bcrypt.hash(password, 12);
        const data = this.userRepo.create({ username, password: hashPass });

        try {
            await this.userRepo.save(data);

            const accessToken = this.jwtService.sign(
                { user_id: data.id },
                { expiresIn: '30m' },
            );

            return {
                message: 'User created successfully',
                data: { id: data.id, username: data.username },
                accessToken,
            };
        } catch (error) {
            // Handle any errors
            return { message: 'Error creating user', error: error.message };
        }
    }


    async login(authDto: AuthDto) {
        try {
            const { username, password } = authDto;

            const findUser = await this.userRepo.findOne({ where: { username } });
            if (!findUser) throw new HttpException('User not found!', 404);

            const verifyPass = await bcrypt.compare(password, findUser.password);
            if (!verifyPass) {
                throw new HttpException('Invalid password', HttpStatus.BAD_REQUEST);
            }

            const accessToken = this.jwtService.sign(
                { user_id: findUser.id, role: findUser.role },
                { expiresIn: '1h' },
            );

            return { accessToken };
        } catch (e) {
            console.log('Login service', e)
            return
        }

    }
}