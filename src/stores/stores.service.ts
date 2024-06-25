import {
    Injectable,
    NotFoundException,
    InternalServerErrorException,
    HttpStatus
} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Store} from '../entities/stores.entity';
import {UsersService} from '../users/users.service';
import {CreateStoreDto} from './dto/store.dto';

@Injectable()
export class StoresService {
    constructor(
        @InjectRepository(Store)
        private readonly storeRepository: Repository<Store>,
        private readonly usersService: UsersService,
    ) {
    }

    async createStore(createStoreDto: CreateStoreDto): Promise<Store> {
        try {
            const {name, adminId} = createStoreDto;

            const admin = await this.usersService.findOneById(adminId);
            if (!admin || admin.role !== 'admin') {
                throw new NotFoundException('Admin not found or user is not an admin');
            }

            const store = this.storeRepository.create({name, admin_id: adminId});
            return await this.storeRepository.save(store);
        } catch (error) {
            throw new InternalServerErrorException('Error creating store', error.message);
        }
    }

    async getStoreStatistics(): Promise<any> {
        try {
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
                statusCode: HttpStatus.OK,
                message: 'Store statistics retrieved successfully',
                data: {
                    storeCount,
                    categoryCounts,
                    productCounts,
                }
            };
        } catch (error) {
            throw new InternalServerErrorException('Error retrieving store statistics', error.message);
        }
    }
}
