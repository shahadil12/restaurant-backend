import { IsEnum, IsString } from 'class-validator';
import { CART_STATUS } from '../entities/cart.entity';

export class CreateCartDto {
  @IsString()
  userUuid: string;

  @IsEnum(CART_STATUS)
  status:CART_STATUS
}
