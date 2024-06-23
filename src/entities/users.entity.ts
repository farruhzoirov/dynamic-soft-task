import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Store } from './stores.entity';
import { Sale } from './sales.entity';
import { Order } from './orders.entity';

@Entity({ name: 'UserEntity' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ default: 'super_admin' })
  role: string;


  @OneToMany(() => Sale, (sale) => sale.soldBy)
  sales: Sale[];

  @OneToMany(() => Order, (order) => order.createdBy)
  orders: Order[];
}
