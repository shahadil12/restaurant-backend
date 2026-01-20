import { Controller, Post, Body, Get, Param, Patch, Delete, Query } from '@nestjs/common';
import { FeatureService } from './feature.service';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { UpdateFeatureDto } from './dto/update-feature.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Controller('feature')
export class FeatureController {
  constructor(private readonly featureService: FeatureService) {}

  @Post()
  create(@Body() dto: CreateFeatureDto) {
    return this.featureService.create(dto);
  }

  @Get()
  findAll(@Query() paginationQuery:PaginationQueryDto) {
    return this.featureService.findAll(paginationQuery);
  }

  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
    return this.featureService.findOne({ uuid });
  }

  @Patch(':uuid')
  update(@Param('uuid') uuid: string, @Body() dto: UpdateFeatureDto) {
    return this.featureService.update(uuid, dto);
  }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.featureService.remove(uuid);
  }
}
