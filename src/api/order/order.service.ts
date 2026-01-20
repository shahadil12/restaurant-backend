import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindOptionsWhere, Repository } from 'typeorm';
import { Order, ORDER_STATUS } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UserService } from '../user/user.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { MenuItem } from '../menu/entities/menu-item.entity';
import { Cart, CART_STATUS } from '../cart/entities/cart.entity';
import { CartItem } from '../cart/entities/cart-item.entity';

@Injectable()
export class OrderService {
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(Order)
    private readonly repository: Repository<Order>,

    @InjectRepository(MenuItem)
    private readonly menuItemRepository: Repository<MenuItem>,

    private readonly userService: UserService,
  ) {}

  async findAll(paginationQuery: PaginationQueryDto, user: JwtPayload) {
    const { limit, offset } = paginationQuery;

    const [list, length] = await this.repository.findAndCount({
      take: limit,
      skip: offset,
      order: { createdAt: 'DESC' },
      where: {
        userId: user.sub,
      },
      relations: {
        items: {
          menuItem: true,
        },
      },
    });

    return { length, list };
  }

  async findOne(conditions: FindOptionsWhere<Order>, user: JwtPayload) {
    const order = await this.repository.findOne({
      where: {
        ...conditions,
        userId: user.sub,
      },
      relations: {
        user: true,
        items: {
          menuItem: true,
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async create(dto: CreateOrderDto, user: JwtPayload) {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('Order must contain at least one item');
    }

    return this.dataSource.transaction(async (manager) => {
      const userData = await this.userService.findOne({
        id: user.sub,
      });

      const cart = await manager.findOne(Cart, {
        where: {
          userId: user.sub,
          status: CART_STATUS.ACTIVE,
        },
        relations: { items: true },
      });

      if (!cart || cart.items.length === 0) {
        throw new BadRequestException('Cart is empty');
      }

      const order = manager.create(Order, {
        userId: userData.id,
        status: ORDER_STATUS.CREATED,
        totalAmount: 0,
      });

      const savedOrder = await manager.save(order);

      let totalAmount = 0;

      for (const item of dto.items) {
        const menuItem = await this.findOneMenuItem(item.menuItemUuid);

        const price = menuItem.offerPrice > 0 ? menuItem.offerPrice : menuItem.price;

        totalAmount += price * item.quantity;

        await manager.save(
          manager.create(OrderItem, {
            orderId: savedOrder.id,
            menuItemId: menuItem.id,
            quantity: item.quantity,
            priceSnapshot: price,
          }),
        );
      }

      savedOrder.totalAmount = totalAmount;
      await manager.save(savedOrder);

      cart.status = CART_STATUS.CHECKED_OUT;
      await manager.save(cart);

      await manager.softDelete(CartItem, {
        cartId: cart.id,
      });

      return true;
    });
  }

  async findOneMenuItem(uuid: string) {
    const menuItem = await this.menuItemRepository.findOne({
      where: {
        uuid,
      },
    });

    if (!menuItem || !menuItem.isAvailable) {
      throw new BadRequestException(`Menu item ${uuid} is not available`);
    }

    return menuItem;
  }

  async cancel(uuid: string, user: JwtPayload) {
    const order = await this.findOne({ uuid }, user);

    if (order.status === ORDER_STATUS.PLACED) {
      throw new BadRequestException('Placed order cannot be cancelled');
    }

    order.status = ORDER_STATUS.CANCELLED;

    await this.repository.save(order);

    return true;
  }
}
