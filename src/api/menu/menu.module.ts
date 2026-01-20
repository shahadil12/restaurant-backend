import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { Menu } from './entities/menu.entity';
import { RestaurantModule } from '../resturant/resturant.module';
import { MenuItem } from './entities/menu-item.entity';
import { RoleFeature } from '../role/entities/role-feature.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Menu,MenuItem,RoleFeature]),
    RestaurantModule,
  ],
  controllers: [MenuController],
  providers: [MenuService],
  exports: [MenuService],
})
export class MenuModule {}
