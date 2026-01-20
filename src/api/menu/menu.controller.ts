import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  UseGuards,
  Query,
  Patch,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { AuthGuard } from '../auth/auth.guard';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { UpdateMenuDto } from './dto/update-menu.dto';

@Controller('menu')
@UseGuards(AuthGuard)
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  create(@Body() dto: CreateMenuDto, @CurrentUser() user: JwtPayload) {
    return this.menuService.create(dto, user);
  }

  @Get()
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.menuService.findAll(paginationQuery);
  }

  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
    return this.menuService.findOne({ uuid });
  }

  @Patch(':uuid')
  update(@Param('uuid') uuid: string, @Body() dto: UpdateMenuDto, @CurrentUser() user: JwtPayload) {
    return this.menuService.update(uuid, dto, user);
  }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.menuService.remove(uuid);
  }
}
