import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { IsNotEmpty, IsString } from 'class-validator';
import { BaseEntity } from 'src/common/base/entity';
import { Region } from 'src/api/region/entities/region.entity';
import { Menu } from 'src/api/menu/entities/menu.entity';

@Entity('restaurant')
export class Restaurant extends BaseEntity {

  @Column()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Column({ nullable: true })
  @IsString()
  thumbnail?: string;

  @ManyToOne(() => Region,region => region.resturants, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'region_id' })
  region: Region;

  @Column({ name: 'region_id', nullable: true })
  regionId: number;

  @OneToMany(() => Menu, menu => menu.restaurant)
  menus: Menu[];
}
