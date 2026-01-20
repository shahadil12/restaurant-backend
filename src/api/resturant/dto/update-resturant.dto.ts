import { PartialType } from '@nestjs/mapped-types';
import { CreateRestaurantDto } from './create-resturant.dto';

export class UpdateResturantDto extends PartialType(CreateRestaurantDto) {}
