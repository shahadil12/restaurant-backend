import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { FeatureName } from '../entities/feature.entity';

export class CreateFeatureDto {
  @IsEnum(FeatureName)
  @IsNotEmpty()
  featureName: FeatureName;
}
