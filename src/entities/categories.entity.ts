import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Store } from './stores.entity';
import { Product } from './products.entity';

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToOne(() => Store, store => store.categories)
    store: Store;

    @OneToMany(() => Product, product => product.category)
    products: Product[];
}
