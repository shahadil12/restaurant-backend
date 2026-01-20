import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateRestaurantDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  thumbnail?: string;

  @IsString()
  regionUuid: string;
}
