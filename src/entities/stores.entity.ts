import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { UserEntity } from './users.entity';
import { Category } from './categories.entity';
import { Order } from './orders.entity';

@Entity()
export class Store {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    admin_id: number;


    @CreateDateColumn()
    createdAt: Date;


    @OneToMany(() => Category, category => category.store)
    categories: Category[];

    @OneToMany(() => Order, order => order.store)
    orders: Order[];
}
