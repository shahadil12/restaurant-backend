import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { BaseEntity } from 'src/common/base/entity';
import { Menu } from 'src/api/menu/entities/menu.entity';
import { OrderItem } from 'src/api/order/entities/order-item.entity';

@Entity('menu_item')
export class MenuItem extends BaseEntity {

  @Column({ nullable: true })
  @IsString()
  thumbnail?: string;

  @Column({ name: 'item_name' })
  @IsString()
  @IsNotEmpty()
  itemName: string;

  @Column({ type: 'decimal' })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @Column({ type: 'decimal' ,default:0})
  @IsNumber()
  offerPrice: number;

  @Column({ name: 'is_available', default: true })
  @IsBoolean()
  isAvailable: boolean;

  @ManyToOne(() => Menu, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'menu_id' })
  menu: Menu;

  @Column({ name: 'menu_id' })
  menuId: number;

  @OneToMany(() => OrderItem, orderItem => orderItem.menuItem)
  orderItems: OrderItem[];
}
