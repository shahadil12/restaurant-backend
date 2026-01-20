import { IsEnum } from 'class-validator';
import { REGION_NAME } from '../entities/region.entity';

export class CreateRegionDto {
  @IsEnum(REGION_NAME)
  regionName: REGION_NAME;
}
