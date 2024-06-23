import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { Store } from './stores.entity';
import { UserEntity } from './users.entity';
import { OrderItem } from './order_items.entity';

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Store, store => store.orders)
    store: Store;

    @Column('decimal')
    totalPrice: number;

    @Column()
    paymentMethod: string;

    @CreateDateColumn()
    orderDate: Date;

    @ManyToOne(() => UserEntity, user => user.orders)
    createdBy: UserEntity;

    @OneToMany(() => OrderItem, orderItem => orderItem.order)
    orderItems: OrderItem[];
}
