import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { BaseEntity } from 'src/common/base/entity';
import { User } from 'src/api/user/entities/user.entity';
import { OrderItem } from 'src/api/order/entities/order-item.entity';

export enum ORDER_STATUS {
  CREATED = 'CREATED',
  PLACED = 'PLACED',
  CANCELLED = 'CANCELLED',
}

@Entity('order')
export class Order extends BaseEntity {

  @Column({ type: 'decimal', name: 'total_amount' })
  @IsNumber()
  @IsNotEmpty()
  totalAmount: number;

  @Column({ type: 'enum', enum: ORDER_STATUS, default: ORDER_STATUS.CREATED })
  @IsEnum(ORDER_STATUS)
  status: ORDER_STATUS;

  @ManyToOne(() => User,user => user.orders ,{ onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id', nullable: true })
  userId: number;
  
  @OneToMany(() => OrderItem, orderItem => orderItem.order)
  items: OrderItem[];
}
