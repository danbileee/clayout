import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { SitesService } from './sites.service';
import {
  CreateSiteDto,
  Pagination,
  UpdateSiteDto,
  SiteSchema,
  PaginateSiteDto,
  PaginateSiteSchema,
} from '@clayout/interface';
import { Roles } from 'src/users/decorators/role.decorator';
import { UserRoleWeights } from 'src/users/constants/role.const';
import { AuthorGuard } from 'src/shared/guards/author.guard';
import { Author } from 'src/shared/decorators/author.decorator';
import { ZodValidationPipe } from 'src/shared/pipes/zod.pipe';
import { User } from 'src/users/decorators/user.decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { SiteEntity } from './entities/site.entity';

@Roles({ minWeight: UserRoleWeights.User })
@Controller('sites')
export class SitesController {
  constructor(private readonly sitesService: SitesService) {}

  @Post()
  create(
    @User() user: UserEntity,
    @Body(new ZodValidationPipe(SiteSchema)) createSiteDto: CreateSiteDto,
  ) {
    return this.sitesService.create(user, createSiteDto);
  }

  @Get()
  findAll(
    @User('id') userId: number,
    @Query(new ZodValidationPipe(PaginateSiteSchema))
    paginateSiteDto: PaginateSiteDto,
  ): Promise<{ results: Pagination<SiteEntity> }> {
    return this.sitesService.paginate(userId, paginateSiteDto);
  }

  @Get(':id')
  @UseGuards(AuthorGuard)
  @Author({
    service: SitesService,
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.sitesService.getById({ id });
  }

  @Patch(':id')
  @UseGuards(AuthorGuard)
  @Author({
    service: SitesService,
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(SiteSchema.optional()))
    updateSiteDto: UpdateSiteDto,
  ) {
    return this.sitesService.update(id, updateSiteDto);
  }

  @Delete(':id')
  @UseGuards(AuthorGuard)
  @Author({
    service: SitesService,
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.sitesService.delete(id);
  }
}
