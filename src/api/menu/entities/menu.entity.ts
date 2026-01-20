import { Entity, ManyToOne, JoinColumn, Column, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/common/base/entity';
import { Restaurant } from 'src/api/resturant/entities/resturant.entity';
import { MenuItem } from 'src/api/menu/entities/menu-item.entity';
import { IsNotEmpty, IsString } from 'class-validator';

@Entity('menu')
export class Menu extends BaseEntity {

  @Column()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ManyToOne(() => Restaurant, resturant => resturant.menus,{ onDelete: 'CASCADE' })
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: Restaurant;

  @Column({ name: 'restaurant_id' })
  restaurantId: number;

  @OneToMany(() => MenuItem, menuItem => menuItem.menu)
  menuItems: MenuItem[];
}
