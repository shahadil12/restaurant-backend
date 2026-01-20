import { Controller, Post, Body, Get, Param, Patch, Delete, Query } from '@nestjs/common';
import { RestaurantService } from './resturant.service';
import { CreateRestaurantDto } from './dto/create-resturant.dto';
import { UpdateResturantDto } from './dto/update-resturant.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Post()
  create(@Body() dto: CreateRestaurantDto) {
    return this.restaurantService.create(dto);
  }

  @Get()
  findAll(@Query() paginationQueryDto: PaginationQueryDto, @CurrentUser() user: JwtPayload) {
    return this.restaurantService.findAll(paginationQueryDto, user);
  }

  @Get(':uuid')
  findOne(@Param('uuid') uuid: string, @CurrentUser() user: JwtPayload) {
    return this.restaurantService.findOne({ uuid }, user);
  }

  @Patch(':uuid')
  update(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateResturantDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.restaurantService.update(uuid, dto, user);
  }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.restaurantService.remove(uuid);
  }
}
