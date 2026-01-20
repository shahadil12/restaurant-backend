import { Entity, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { BaseEntity } from 'src/common/base/entity';
import { Role } from 'src/api/role/entities/role.entity';
import { Feature } from 'src/api/feature/entities/feature.entity';

@Entity('role_feature')
@Unique(['roleId', 'featureId'])
export class RoleFeature extends BaseEntity {

  @ManyToOne(() => Role,role => role.roleFeatures, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Column({ name: 'role_id' })
  roleId: number;

  @ManyToOne(() => Feature,feature => feature.roleFeatures, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'feature_id' })
  feature: Feature;

  @Column({ name: 'feature_id' })
  featureId: number;
}
