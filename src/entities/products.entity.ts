import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Category } from './categories.entity';
import { Sale } from './sales.entity';
import { OrderItem } from './order_items.entity';

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column('decimal', { precision: 10, scale: 2 })
    costPrice: number;

    @Column('decimal', { precision: 10, scale: 2 })
    salePrice: number;

    @Column()
    amount: number;

    @Column({ nullable: true })
    image: string;

    @Column('decimal', { precision: 10, scale: 2, default: '0.00' })
    discount: number;

    @ManyToOne(() => Category, category => category.products)
    category: Category;

    @OneToMany(() => Sale, sale => sale.product)
    sales: Sale[];

    @OneToMany(() => OrderItem, orderItem => orderItem.product)
    orderItems: OrderItem[];
}
