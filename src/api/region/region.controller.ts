import { Controller, Post, Body, Get, Param, Patch, Delete, Query } from '@nestjs/common';
import { RegionService } from './region.service';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Controller('region')
export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  @Post()
  create(@Body() dto: CreateRegionDto) {
    return this.regionService.create(dto);
  }

  @Get()
  findAll(@Query() paginationQueryDto:PaginationQueryDto) {
    return this.regionService.findAll(paginationQueryDto);
  }

  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
    return this.regionService.findOne({ uuid });
  }

  @Patch(':uuid')
  update(@Param('uuid') uuid: string, @Body() dto: UpdateRegionDto) {
    return this.regionService.update(uuid, dto);
  }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.regionService.remove(uuid);
  }
}
