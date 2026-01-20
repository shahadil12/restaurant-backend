import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Menu } from './entities/menu.entity';
import { MenuItem } from './entities/menu-item.entity';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { RestaurantService } from '../resturant/resturant.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private readonly repository: Repository<Menu>,

    @InjectRepository(MenuItem)
    private readonly menuItemRepository: Repository<MenuItem>,

    private readonly restaurantService: RestaurantService,
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

  async findOne(conditions: FindOptionsWhere<Menu>) {
    const menu = await this.repository.findOne({
      where: conditions,
      relations: {
        restaurant: true,
        menuItems: true,
      },
    });

    if (!menu) {
      throw new NotFoundException('Menu not found');
    }

    return menu;
  }

  async create(dto: CreateMenuDto, user: JwtPayload) {
    const restaurant = await this.restaurantService.findOne(
      {
        uuid: dto.restaurantUuid,
      },
      user,
    );

    const menu = this.repository.create({
      restaurantId: restaurant.id,
    });

    const savedMenu = await this.repository.save(menu);

    await this.syncMenuItems(savedMenu.id, dto.items);

    return this.findOne({ id: savedMenu.id });
  }

  async update(uuid: string, dto: UpdateMenuDto, user: JwtPayload) {
    const menu = await this.findOne({ uuid });

    if (dto.restaurantUuid) {
      const restaurant = await this.restaurantService.findOne(
        {
          uuid: dto.restaurantUuid,
        },
        user,
      );
      menu.restaurantId = restaurant.id;
    }

    await this.repository.save(menu);

    if (dto.items) {
      await this.syncMenuItems(menu.id, dto.items);
    }

    return this.findOne({ id: menu.id });
  }

  private async syncMenuItems(
    menuId: number,
    items: {
      uuid?: string;
      itemName: string;
      price: number;
      offerPrice: number;
      isAvailable: boolean;
    }[],
  ) {
    const existingItems = await this.menuItemRepository.find({
      where: { menuId },
    });

    const existingMap = new Map(existingItems.map((item) => [item.uuid, item]));

    const incomingUuids = new Set<string>();

    for (const item of items) {
      if (item.price < item.offerPrice) {
        throw new BadRequestException('Offer price cannot be greater than price');
      }

      if (item.uuid && existingMap.has(item.uuid)) {
        const existing = existingMap.get(item.uuid);
        Object.assign(existing!, item);
        await this.menuItemRepository.save(existing!);
        incomingUuids.add(item.uuid);
      } else {
        const created = this.menuItemRepository.create({
          menuId,
          ...item,
        });
        await this.menuItemRepository.save(created);
      }
    }

    for (const existing of existingItems) {
      if (!incomingUuids.has(existing.uuid)) {
        await this.menuItemRepository.softDelete({
          uuid: existing.uuid,
        });
      }
    }
  }

  async remove(uuid: string) {
    const result = await this.repository.softDelete({ uuid });

    if (!result.affected) {
      throw new NotFoundException('Menu not found');
    }

    return true;
  }
}
