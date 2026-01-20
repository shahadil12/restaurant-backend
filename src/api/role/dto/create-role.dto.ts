import { IsEnum, IsOptional, IsArray, IsString } from 'class-validator';
import { RoleName } from '../entities/role.entity';

export class CreateRoleDto {
  @IsEnum(RoleName)
  roleName: RoleName;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  featureUuids?: string[];
}
