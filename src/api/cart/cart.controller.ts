import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get('active')
  getActiveCart(@CurrentUser() user:JwtPayload) {
    return this.cartService.getActiveCart(user);
  }

  @Post('item')
  addItem(
    @CurrentUser() user:JwtPayload,
    @Body()
    body: {
      menuItemUuid: string;
      quantity: number;
    },
  ) {
    return this.cartService.addItem(
      user,
      body.menuItemUuid,
      body.quantity,
    );
  }

  @Patch('item/:cartItemUuid')
  updateItemQuantity(
    @Param('cartItemUuid') cartItemUuid: string,
    @CurrentUser() user:JwtPayload,
    @Body() body: { quantity: number },
  ) {
    return this.cartService.updateItemQuantity(
      user,
      cartItemUuid,
      body.quantity,
    );
  }

  @Delete('item/:cartItemUuid')
  removeItem(
    @Param('cartItemUuid') cartItemUuid: string,
    @CurrentUser() user:JwtPayload,
  ) {
    return this.cartService.removeItem(cartItemUuid,user);
  }

  @Delete(':cartUuid/items')
  clearCart(
    @Param('cartUuid') cartUuid: string,
    @CurrentUser() user:JwtPayload,
    ) {
    return this.cartService.clearCart(cartUuid,user);
  }
}
