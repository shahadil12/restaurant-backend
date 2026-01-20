import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { BaseEntity } from 'src/common/base/entity';
import { Order } from 'src/api/order/entities/order.entity';
import { MenuItem } from 'src/api/menu/entities/menu-item.entity';

@Entity('order_item')
export class OrderItem extends BaseEntity {

  @Column()
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @Column({ type: 'decimal', name: 'price_snapshot' })
  @IsNumber()
  @IsNotEmpty()
  priceSnapshot: number;

  @ManyToOne(() => Order,order => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ name: 'order_id' })
  orderId: number;

  @ManyToOne(() => MenuItem, menuItem => menuItem.orderItems,{ onDelete: 'SET NULL' })
  @JoinColumn({ name: 'menu_item_id' })
  menuItem: MenuItem;

  @Column({ name: 'menu_item_id', nullable: true })
  menuItemId: number;
}
