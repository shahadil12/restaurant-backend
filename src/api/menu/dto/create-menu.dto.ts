import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class MenuItemDto {
  @IsOptional()
  @IsString()
  uuid?: string;

  @IsString()
  itemName: string;

  @IsNumber()
  price: number;

  @IsNumber()
  offerPrice: number;

  @IsBoolean()
  isAvailable: boolean;
}

export class CreateMenuDto {
  @IsString()
  restaurantUuid: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MenuItemDto)
  items: MenuItemDto[];
}
