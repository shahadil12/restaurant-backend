import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { RegionService } from '../region/region.service';
import { Restaurant } from './entities/resturant.entity';
import { CreateRestaurantDto } from './dto/create-resturant.dto';
import { UpdateResturantDto } from './dto/update-resturant.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly repository: Repository<Restaurant>,
    private readonly regionService: RegionService,
  ) {}

  async findAll(paginationQuery: PaginationQueryDto, user: JwtPayload) {
    const { limit, offset } = paginationQuery;

    const [list, length] = await this.repository.findAndCount({
      ...(!user.isAdmin ? { where: { regionId: user.regionId } } : {}),
      take: limit,
      skip: offset,
      order: { createdAt: 'DESC' },
    });

    return { length, list };
  }

  async findOne(conditions: FindOptionsWhere<Restaurant>, user: JwtPayload) {
    const restaurant = await this.repository.findOne({
      where: {
        ...conditions,
        ...(!user.isAdmin ? { regionId: user.regionId } : {}),
      },
      relations: {
        region: true,
        menus: {
          menuItems: true,
        },
      },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    return restaurant;
  }

  async create(dto: CreateRestaurantDto) {
    const restaurant = this.repository.create(dto);

    restaurant.region = await this.regionService.findOne({
      uuid: dto.regionUuid,
    });

    return this.repository.save(restaurant);
  }

  async update(uuid: string, dto: UpdateResturantDto, user: JwtPayload) {
    const restaurant = await this.findOne({ uuid }, user);

    Object.assign(restaurant, dto);

    if (dto.regionUuid) {
      restaurant.region = await this.regionService.findOne({ uuid: dto.regionUuid });
    }

    await this.repository.save(restaurant);

    return true;
  }

  async remove(uuid: string) {
    const result = await this.repository.softDelete({ uuid });

    if (!result.affected) {
      throw new NotFoundException('Restaurant not found');
    }

    return true;
  }
}
