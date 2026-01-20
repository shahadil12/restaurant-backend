import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegionModule } from '../region/region.module';
import { Restaurant } from './entities/resturant.entity';
import { RestaurantController } from './resturant.controller';
import { RestaurantService } from './resturant.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Restaurant]),
    RegionModule,
  ],
  controllers: [RestaurantController],
  providers: [RestaurantService],
  exports: [RestaurantService],
})
export class RestaurantModule {}
