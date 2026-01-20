import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { Role } from './entities/role.entity';
import { RoleFeature } from './entities/role-feature.entity';
import { FeatureModule } from '../feature/feature.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, RoleFeature]),
    FeatureModule,
  ],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}

