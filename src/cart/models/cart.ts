import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CartStatuses } from './cart.status';
import { CartItem } from './cart.item';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @Column('bigint')
  created_at: number;

  @Column('bigint')
  updated_at: number;

  @Column({
    type: 'enum',
    enum: CartStatuses,
  })
  status: CartStatuses;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart, { cascade: true })
  items: CartItem[];
}