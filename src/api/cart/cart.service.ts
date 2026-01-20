import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Cart, CART_STATUS } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { UserService } from '../user/user.service';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { MenuItem } from '../menu/entities/menu-item.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,

    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,

    @InjectRepository(MenuItem)
    private readonly menuItemRepository: Repository<MenuItem>,
  ) {}

  async getActiveCart(user: JwtPayload) {
    let cart = await this.cartRepository.findOne({
      where: {
        userId: user.sub,
        status: CART_STATUS.ACTIVE,
      },
      relations: {
        items: { menuItem: { menu: true } },
      },
    });

    if (!cart) {
      cart = this.cartRepository.create({
        userId: user.sub,
        status: CART_STATUS.ACTIVE,
      });
      cart = await this.cartRepository.save(cart);
    }

    return cart;
  }

  async addItem(user: JwtPayload, menuItemUuid: string, quantity: number) {
    if (quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than zero');
    }

    const cart = await this.getActiveCart(user);

    if (cart.status !== CART_STATUS.ACTIVE) {
      throw new BadRequestException('Cart is not active');
    }

    const menuItem = await this.findOneMenuItem(menuItemUuid)

    const existingItem = cart.items.find((item) => item.menuItemId === menuItem.id);

    if (existingItem) {
      existingItem.quantity += quantity;
      return this.cartItemRepository.save(existingItem);
    }

    const cartItem = this.cartItemRepository.create({
      cartId: cart.id,
      menuItemId: menuItem.id,
      quantity,
    });

    await this.cartItemRepository.save(cartItem);
    return true;
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

  async updateItemQuantity(user: JwtPayload, cartItemUuid: string, quantity: number) {
    if (quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than zero');
    }

    const cartItem = await this.cartItemRepository.findOne({
      where: {
        uuid: cartItemUuid,
        cart: {
          userId: user.sub,
        },
      },
      relations: { cart: true },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    if (cartItem.cart.status !== CART_STATUS.ACTIVE) {
      throw new BadRequestException('Cannot modify checked-out cart');
    }

    cartItem.quantity = quantity;
    await this.cartItemRepository.save(cartItem);

    return true;
  }

  async removeItem(cartItemUuid: string, user: JwtPayload) {
    const cartItem = await this.cartItemRepository.findOne({
      where: {
        uuid: cartItemUuid,
        cart: {
          userId: user.sub,
        },
      },
      relations: { cart: true },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    if (cartItem.cart.status !== CART_STATUS.ACTIVE) {
      throw new BadRequestException('Cannot modify checked-out cart');
    }

    await this.cartItemRepository.softDelete({
      uuid: cartItemUuid,
    });

    return true;
  }

  async clearCart(cartUuid: string, user: JwtPayload) {
    const cart = await this.cartRepository.findOne({
      where: { uuid: cartUuid, userId: user.sub },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    if (cart.status !== CART_STATUS.ACTIVE) {
      throw new BadRequestException('Cannot clear checked-out cart');
    }

    await this.cartItemRepository.softDelete({
      cartId: cart.id,
    });

    return true;
  }

  async checkout(cartId: number) {
    const cart = await this.cartRepository.findOne({
      where: { id: cartId },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    cart.status = CART_STATUS.CHECKED_OUT;
    return this.cartRepository.save(cart);
  }
}
