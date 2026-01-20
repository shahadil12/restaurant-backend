import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { IsEnum } from 'class-validator';
import { BaseEntity } from 'src/common/base/entity';
import { User } from 'src/api/user/entities/user.entity';
import { CartItem } from './cart-item.entity';

export enum CART_STATUS {
  ACTIVE = 'ACTIVE',
  CHECKED_OUT = 'CHECKED_OUT',
}

@Entity('cart')
export class Cart extends BaseEntity {

  @Column({
    type: 'enum',
    enum: CART_STATUS,
    default: CART_STATUS.ACTIVE,
  })
  @IsEnum(CART_STATUS)
  status: CART_STATUS;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id', nullable: true })
  userId: number;

  @OneToMany(() => CartItem, item => item.cart, { cascade: true })
  items: CartItem[];
}
