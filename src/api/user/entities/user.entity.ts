import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { BaseEntity } from 'src/common/base/entity';
import { Role } from 'src/api/role/entities/role.entity';
import { Region } from 'src/api/region/entities/region.entity';
import { Order } from 'src/api/order/entities/order.entity';

@Entity('user')
export class User extends BaseEntity {
  @Column({ name: 'user_name', unique: true })
  @IsString()
  @IsNotEmpty()
  userName: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  password: string;

  @Column({ name: 'is_active' })
  @IsBoolean()
  isActive: boolean;

  @ManyToOne(() => Role, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Column({ name: 'role_id', nullable: true })
  roleId: number;

  @ManyToOne(() => Region, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'region_id' })
  region: Region;

  @Column({ name: 'region_id', nullable: true })
  regionId: number;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
