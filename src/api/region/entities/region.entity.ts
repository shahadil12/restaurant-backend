import { Entity, Column, OneToMany } from 'typeorm';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { BaseEntity } from 'src/common/base/entity';
import { User } from 'src/api/user/entities/user.entity';
import { Restaurant } from 'src/api/resturant/entities/resturant.entity';

export enum REGION_NAME {
  INDIA = 'India',
  AMERICA = 'America',
}

@Entity('region')
export class Region extends BaseEntity {

  @Column({ name: 'region_name', unique: true })
  @IsEnum(REGION_NAME)
  @IsNotEmpty()
  regionName: REGION_NAME;

  @OneToMany(() => User, (user) => user.region)
  users: User[];

  @OneToMany(() => Restaurant, restaurant => restaurant.region)
  resturants: Restaurant[];
}
