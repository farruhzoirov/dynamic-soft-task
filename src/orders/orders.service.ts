import {Injectable, NotFoundException, InternalServerErrorException, HttpStatus} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Order} from '../entities/orders.entity';
import {Product} from '../entities/products.entity';
import {Sale} from '../entities/sales.entity';
import {OrderItem} from '../entities/order_items.entity';
import {CreateOrderDto} from './dto/order.dto';
import {UserEntity} from '../entities/users.entity';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @InjectRepository(Sale)
        private readonly saleRepository: Repository<Sale>,
        @InjectRepository(OrderItem)
        private readonly orderItemRepository: Repository<OrderItem>,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) {
    }

    async createOrder(createOrderDto: CreateOrderDto, userId: number) {
        try {
            const {items, paymentMethod} = createOrderDto;

            const user = await this.userRepository.findOne({where: {id: userId}});
            if (!user) {
                throw new NotFoundException('User not found');
            }

            const order = this.orderRepository.create({createdBy: user});
            await this.orderRepository.save(order);

            for (const item of items) {
                const product = await this.productRepository.findOne({where: {id: item.productId}});

                if (!product) {
                    throw new NotFoundException(`Product with id ${item.productId} not found`);
                }

                const orderItem = this.orderItemRepository.create({
                    order,
                    product,
                    quantity: item.quantity,
                    price: product.salePrice * (1 - item.discount / 100),
                });

                await this.orderItemRepository.save(orderItem);

                const sale = this.saleRepository.create({
                    product,
                    quantity: item.quantity,
                    totalPrice: product.salePrice * item.quantity * (1 - item.discount / 100),
                    paymentMethod,
                    soldBy: user,
                    saleDate: new Date(),
                });

                await this.saleRepository.save(sale);
            }

            return {
                statusCode: HttpStatus.OK,
                message: 'Order created successfully',
                order
            };
        } catch (error) {
            throw new InternalServerErrorException('Error creating order', error.message);
        }
    }
}
