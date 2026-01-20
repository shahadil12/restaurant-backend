import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '../config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeOrm.config';
import { DataSource } from 'typeorm';
import { AuthModule } from './api/auth/auth.module';
import { RoleModule } from './api/role/role.module';
import { FeatureModule } from './api/feature/feature.module';
import { RegionModule } from './api/region/region.module';
import { UserModule } from './api/user/user.module';
import { RestaurantModule } from './api/resturant/resturant.module';
import { MenuModule } from './api/menu/menu.module';
import { OrderModule } from './api/order/order.module';
import { PaymentMethodModule } from './api/payment-method/payment-method.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './api/auth/auth.guard';
import { RoleFeature } from './api/role/entities/role-feature.entity';
import { CartModule } from './api/cart/cart.module';

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: typeOrmConfig,
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([RoleFeature]),
    AuthModule,
    RoleModule,
    FeatureModule,
    RegionModule,
    UserModule,
    RestaurantModule,
    MenuModule,
    OrderModule,
    PaymentMethodModule,
    CartModule
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly dataSource: DataSource) {}

  onModuleInit() {
    // Listen to connection events
    if (this.dataSource.isInitialized)
      Logger.log('Connection established successfully', 'TypeORM MySQL');
  }
}
