import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Feature } from '../auth/decorators/feature.decorator';
import { FeatureName } from '../feature/entities/feature.entity';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @Feature(FeatureName.CREATE_ORDER)
  create(@Body() dto: CreateOrderDto, @CurrentUser() user: JwtPayload) {
    return this.orderService.create(dto, user);
  }

  @Get()
  findAll(@Query() paginationQueryDto: PaginationQueryDto, @CurrentUser() user: JwtPayload) {
    return this.orderService.findAll(paginationQueryDto,user);
  }

  @Get(':uuid')
  findOne(@Param('uuid') uuid: string, @CurrentUser() user: JwtPayload) {
    return this.orderService.findOne({ uuid }, user);
  }

  @Patch(':uuid/cancel')
  @Feature(FeatureName.CANCEL_ORDER)
  cancel(@Param('uuid') uuid: string, @CurrentUser() user: JwtPayload) {
    return this.orderService.cancel(uuid, user);
  }
}
