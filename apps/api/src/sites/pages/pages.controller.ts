import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { SitePagesService } from './pages.service';
import { Roles } from 'src/users/decorators/role.decorator';
import { UserRoleWeights } from 'src/users/constants/role.const';
import { ZodValidationPipe } from 'src/shared/pipes/zod.pipe';
import { ChangeSiteHomePageDto, SitePageSchema } from '@clayout/interface';
import { UpdateSitePageDto } from '@clayout/interface';
import { CreateSitePageDto } from '@clayout/interface';

@Roles({ minWeight: UserRoleWeights.User })
@Controller('sites/:siteId/pages')
export class SitePagesController {
  constructor(private readonly sitePagesService: SitePagesService) {}

  @Post()
  create(
    @Param('siteId', ParseIntPipe) siteId: number,
    @Body(new ZodValidationPipe(SitePageSchema))
    createSitePageDto: CreateSitePageDto,
  ) {
    return this.sitePagesService.create(createSitePageDto, siteId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.sitePagesService.getById({ id });
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(SitePageSchema.partial()))
    updateSitePageDto: UpdateSitePageDto,
  ) {
    return this.sitePagesService.update(id, updateSitePageDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.sitePagesService.delete(id);
  }

  @Patch(':id/home')
  changeHome(
    @Param('id', ParseIntPipe) id: number,
    @Body() { newId }: ChangeSiteHomePageDto,
  ) {
    return this.sitePagesService.changeHome(id, newId);
  }
}
