import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Product } from './products.entity';
import { UserEntity } from './users.entity';

@Entity()
export class Sale {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Product, product => product.sales)
    product: Product;

    @Column()
    quantity: number;

    @Column('decimal')
    totalPrice: number;

    @Column()
    paymentMethod: string;

    @ManyToOne(() => UserEntity, user => user.sales)
    soldBy: UserEntity;

    @CreateDateColumn()
    saleDate: Date;
}
