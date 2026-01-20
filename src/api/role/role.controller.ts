import { Controller, Post, Body, Get, Param, Patch, Delete, Query } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  create(@Body() dto: CreateRoleDto) {
    return this.roleService.create(dto);
  }

  @Get()
  findAll(@Query() paginationQueryDto:PaginationQueryDto) {
    return this.roleService.findAll(paginationQueryDto);
  }

  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
    return this.roleService.findOne({ uuid });
  }

  @Patch(':uuid')
  update(@Param('uuid') uuid: string, @Body() dto: UpdateRoleDto) {
    return this.roleService.update(uuid, dto);
  }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.roleService.remove(uuid);
  }
}
