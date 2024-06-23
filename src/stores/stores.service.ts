import {Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Store} from "../entities/stores.entity";
import {Repository} from "typeorm";
import {UsersService} from "../users/users.service";
import {UserEntity} from "../entities/users.entity";
import {CreateStoreDto} from "./dto/store.dto";

@Injectable()
export class StoresService {
    constructor(
        @InjectRepository(Store)
        private readonly storeRepository: Repository<Store>,
        private readonly usersService: UsersService,
    ) {
    }

    async createStore(createStoreDto: CreateStoreDto): Promise<Store> {

        const {name, adminId} = createStoreDto;

        const admin = await this.usersService.findOneById(adminId);
        if (!admin || admin.role !== 'admin') {
            throw new NotFoundException('Admin not found or user is not an admin');
        }

        const store = this.storeRepository.create({name, admin_id: adminId});
        return this.storeRepository.save(store);
    }


    async getStoreStatistics(): Promise<any> {
        const storeCount = await this.storeRepository.count();

        const categoryCounts = await this.storeRepository
            .createQueryBuilder('store')
            .leftJoinAndSelect('store.categories', 'category')
            .select('store.id')
            .addSelect('COUNT(category.id)', 'categoryCount')
            .groupBy('store.id')
            .getRawMany();

        const productCounts = await this.storeRepository
            .createQueryBuilder('store')
            .leftJoinAndSelect('store.categories', 'category')
            .leftJoinAndSelect('category.products', 'product')
            .select('store.id')
            .addSelect('COUNT(product.id)', 'productCount')
            .groupBy('store.id')
            .getRawMany();

        return {
            storeCount,
            categoryCounts,
            productCounts,
        };
    }

}
