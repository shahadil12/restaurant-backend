import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { PaymentMethod } from './entities/payment-method.entity';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Injectable()
export class PaymentMethodService {
  constructor(
    @InjectRepository(PaymentMethod)
    private readonly repository: Repository<PaymentMethod>,
  ) {}

  async findAll(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;

    const [list, length] = await this.repository.findAndCount({
      take: limit,
      skip: offset,
      order: { createdAt: 'DESC' },
    });

    return { length, list };
  }

  async findOne(conditions: FindOptionsWhere<PaymentMethod>) {
    const method = await this.repository.findOne({ where: conditions });

    if (!method) {
      throw new NotFoundException('Payment method not found');
    }

    return method;
  }

  async create(dto: CreatePaymentMethodDto) {
    const method = this.repository.create(dto);
    return this.repository.save(method);
  }

  async update(uuid: string, dto: UpdatePaymentMethodDto) {
    const method = this.repository.create(dto);

    const updateResponse = await this.repository.update({ uuid }, method);

    if (!updateResponse.affected) {
      throw new InternalServerErrorException(`Unable to update #${uuid} payment method`);
    }

    return true;
  }

  async remove(uuid: string) {
    const result = await this.repository.softDelete({ uuid });

    if (!result.affected) {
      throw new InternalServerErrorException(`Unable to delete #${uuid} payment method`);
    }

    return true;
  }
}
