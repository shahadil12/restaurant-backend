import { Entity, Column, OneToMany } from 'typeorm';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { BaseEntity } from 'src/common/base/entity';
import { User } from 'src/api/user/entities/user.entity';
import { RoleFeature } from 'src/api/role/entities/role-feature.entity';

export enum RoleName {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  MEMBER = 'MEMBER',
}

@Entity('role')
export class Role extends BaseEntity {

  @Column({ name: 'role_name', unique: true })
  @IsEnum(RoleName)
  @IsNotEmpty()
  roleName: RoleName;

  @OneToMany(() => User, (user) => user.role)
  users: User[];

  @OneToMany(() => RoleFeature, roleFeature => roleFeature.role)
  roleFeatures: RoleFeature[];
}
