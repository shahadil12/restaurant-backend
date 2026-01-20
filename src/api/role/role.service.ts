import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { RoleFeature } from './entities/role-feature.entity';
import { FeatureService } from '../feature/feature.service';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly repository: Repository<Role>,

    @InjectRepository(RoleFeature)
    private readonly roleFeatureRepository: Repository<RoleFeature>,

    private readonly featureService: FeatureService,
  ) {}

  async findAll(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;

    const [list, length] = await this.repository.findAndCount({
      take: limit,
      skip: offset,
      order: { createdAt: 'DESC' },
    });

    return { length, list };
  }

  async findOne(conditions: FindOptionsWhere<Role>) {
    const role = await this.repository.findOne({
      where: conditions,
      relations: {
        roleFeatures: {
          feature: true,
        },
      },
    });

    if (!role) throw new NotFoundException('Role not found');

    return role;
  }

  async create(dto: CreateRoleDto) {
    const role = this.repository.create({
      roleName: dto.roleName,
    });

    const savedRole = await this.repository.save(role);

    if (dto.featureUuids?.length) {
      await this.syncRoleFeatures(savedRole.id, dto.featureUuids);
    }

    return this.findOne({ id: savedRole.id });
  }

  async update(uuid: string, dto: UpdateRoleDto) {
    const role = await this.findOne({ uuid });

    Object.assign(role, dto);
    
    await this.repository.save(role);

    if (dto.featureUuids) {
      await this.syncRoleFeatures(role.id, dto.featureUuids);
    }

    return this.findOne({ id: role.id });
  }

  async remove(uuid: string) {
    const result = await this.repository.softDelete({ uuid });
    if (!result.affected) throw new NotFoundException('Role not found');
    return true;
  }

  private async syncRoleFeatures(roleId: number, featureUuids: string[]) {
    const features = await Promise.all(
      featureUuids.map((uuid) => this.featureService.findOne({ uuid })),
    );

    await this.roleFeatureRepository.softDelete({ roleId });

    const roleFeatures = features.map((feature) =>
      this.roleFeatureRepository.create({
        roleId,
        featureId: feature.id,
      }),
    );

    await this.roleFeatureRepository.save(roleFeatures);
  }
}
