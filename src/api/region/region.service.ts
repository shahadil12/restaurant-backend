import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Region } from './entities/region.entity';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Injectable()
export class RegionService {
  constructor(
    @InjectRepository(Region)
    private readonly repository: Repository<Region>,
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

  async findOne(conditions: FindOptionsWhere<Region>) {
    const region = await this.repository.findOne({ where: conditions });

    if (!region) {
      throw new NotFoundException('Region not found');
    }

    return region;
  }

  async create(dto: CreateRegionDto) {
    const region = this.repository.create(dto);
    return this.repository.save(region);
  }

  async update(uuid: string, dto: UpdateRegionDto) {
    const region = this.repository.create(dto);

    const updateResponse = await this.repository.update({ uuid }, region);

    if (!updateResponse.affected) {
      throw new InternalServerErrorException(`Unable to update #${uuid} payment method`);
    }

    return true;
  }

  async remove(uuid: string) {
    const result = await this.repository.softDelete({ uuid });

    if (!result.affected) {
      throw new InternalServerErrorException(`Unable to delete #${uuid} region`);
    }

    return true;
  }
}
