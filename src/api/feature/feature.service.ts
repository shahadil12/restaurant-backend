import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Feature } from './entities/feature.entity';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { UpdateFeatureDto } from './dto/update-feature.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Injectable()
export class FeatureService {
  constructor(
    @InjectRepository(Feature)
    private readonly repository: Repository<Feature>,
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

  async findOne(conditions: FindOptionsWhere<Feature>) {
    const feature = await this.repository.findOne({ where: conditions });

    if (!feature) {
      throw new NotFoundException('Feature not found');
    }

    return feature;
  }

  async create(dto: CreateFeatureDto) {
    const feature = this.repository.create(dto);
    return this.repository.save(feature);
  }

  async update(uuid: string, dto: UpdateFeatureDto) {
    const feature = this.repository.create(dto);

    const updateResponse = await this.repository.update({ uuid }, feature);

    if (!updateResponse.affected) {
      throw new InternalServerErrorException(`Unable to update #${uuid} feature`);
    }

    return true;
  }

  async remove(uuid: string) {
    const result = await this.repository.softDelete({ uuid });

    if (!result.affected) {
      throw new InternalServerErrorException(`Unable to delete #${uuid} feature`);
    }

    return true;
  }
}
