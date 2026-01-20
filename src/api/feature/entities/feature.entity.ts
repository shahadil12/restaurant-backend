import { Entity, Column, OneToMany } from 'typeorm';
import { IsNotEmpty, IsString } from 'class-validator';
import { BaseEntity } from 'src/common/base/entity';
import { RoleFeature } from 'src/api/role/entities/role-feature.entity';

export enum FeatureName {
  VIEW_RESTAURANT = 'VIEW_RESTAURANT',
  CREATE_ORDER = 'CREATE_ORDER',
  PLACE_ORDER = 'PLACE_ORDER',
  CANCEL_ORDER = 'CANCEL_ORDER',
  UPDATE_PAYMENT = 'UPDATE_PAYMENT',
}

@Entity('feature')
export class Feature extends BaseEntity {
  @Column({ name: 'feature_name', type:"enum",unique: true,enum:FeatureName })
  @IsString()
  @IsNotEmpty()
  featureName: FeatureName;

  @OneToMany(() => RoleFeature, roleFeature => roleFeature.role)
  roleFeatures: RoleFeature[];
}
