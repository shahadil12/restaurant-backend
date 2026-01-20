import { Controller, Post, Body, Get, Param, Patch, Delete, Query } from '@nestjs/common';
import { PaymentMethodService } from './payment-method.service';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { FeatureName } from '../feature/entities/feature.entity';
import { Feature } from '../auth/decorators/feature.decorator';

@Controller('payment-method')
export class PaymentMethodController {
  constructor(private readonly paymentMethodService: PaymentMethodService) {}

  @Post()
  create(@Body() dto: CreatePaymentMethodDto) {
    return this.paymentMethodService.create(dto);
  }

  @Get()
  findAll(@Query() paginationQueryDto:PaginationQueryDto) {
    return this.paymentMethodService.findAll(paginationQueryDto);
  }

  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
    return this.paymentMethodService.findOne({ uuid });
  }

  @Patch(':uuid')
  @Feature(FeatureName.UPDATE_PAYMENT)
  update(@Param('uuid') uuid: string, @Body() dto: UpdatePaymentMethodDto) {
    return this.paymentMethodService.update(uuid, dto);
  }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.paymentMethodService.remove(uuid);
  }
}
