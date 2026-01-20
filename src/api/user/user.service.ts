import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RoleService } from '../role/role.service';
import { RegionService } from '../region/region.service';
import * as bcrypt from 'bcryptjs';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
    private readonly roleService: RoleService,
    private readonly regionService: RegionService,
  ) {}

  async findAll(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;

    const [list, length] = await this.repository.findAndCount({
      where:{
        isActive:true
      },
      take: limit,
      skip: offset,
      order: { createdAt: 'DESC' },
    });

    return { length, list };
  }

  async findOne(conditions: FindOptionsWhere<User>) {
    const user = await this.repository.findOne({
      where: {
        ...conditions,
        isActive:false
      },
      relations: {
        role: {
          roleFeatures:{
            feature:true
          }
        },
        region: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    return user;
  }

  async create(createUserDto: CreateUserDto) {
    const user = this.repository.create(createUserDto);

    user.password = await bcrypt.hash(createUserDto.password, 10);

    user.role = await this.roleService.findOne({ uuid: createUserDto.roleUuid });
    user.region = await this.regionService.findOne({ uuid: createUserDto.regionUuid });

    return this.repository.save(user);
  }

  async update(uuid: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne({ uuid });

    Object.assign(user, updateUserDto);

    if (updateUserDto.password) {
      user.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    if (updateUserDto.roleUuid) {
      user.role = await this.roleService.findOne({ uuid: updateUserDto.roleUuid });
    }

    if (updateUserDto.regionUuid) {
      user.region = await this.regionService.findOne({ uuid: updateUserDto.regionUuid });
    }

    await this.repository.save(user)

    return true;
  }

  async remove(uuid: string) {
    const result = await this.repository.update(
      { 
        uuid 
      },
      {
        isActive: false,
      },
    );

    if (!result.affected) {
      throw new NotFoundException(`User not found`);
    }

    return true;
  }
}
