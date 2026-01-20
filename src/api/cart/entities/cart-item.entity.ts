import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { BaseEntity } from 'src/common/base/entity';
import { Cart } from 'src/api/cart/entities/cart.entity';
import { MenuItem } from 'src/api/menu/entities/menu-item.entity';

@Entity('cart_item')
export class CartItem extends BaseEntity {

  @Column()
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  /* -------------------------
   * Cart
   * ------------------------- */
  @ManyToOne(() => Cart, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;

  @Column({ name: 'cart_id' })
  cartId: number;

  /* -------------------------
   * Menu Item
   * ------------------------- */
  @ManyToOne(() => MenuItem, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'menu_item_id' })
  menuItem: MenuItem;

  @Column({ name: 'menu_item_id', nullable: true })
  menuItemId: number;
}
