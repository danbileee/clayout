import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  ParseIntPipe,
} from '@nestjs/common';
import { SitesService } from './sites.service';
import { CreateSiteDto, UpdateSiteDto } from './dto/site.dto';
import { Roles } from 'src/users/decorators/role.decorator';
import { UserRoleWeights } from 'src/users/constants/role.const';
import { AuthorGuard } from 'src/shared/guards/author.guard';
import { Author } from 'src/shared/decorators/author.decorator';
import { ZodValidationPipe } from 'src/shared/pipes/zod.pipe';
import { SiteSchema } from '@clayout/interface';

@Roles({ minWeight: UserRoleWeights.User })
@Controller('sites')
export class SitesController {
  constructor(private readonly sitesService: SitesService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(SiteSchema))
  create(@Body() createSiteDto: CreateSiteDto) {
    return this.sitesService.create(createSiteDto);
  }

  @Get()
  findAll() {
    return this.sitesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.sitesService.findOne(id);
  }

  @UseGuards(AuthorGuard)
  @Author({
    service: SitesService,
  })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSiteDto: UpdateSiteDto,
  ) {
    return this.sitesService.update(id, updateSiteDto);
  }

  @UseGuards(AuthorGuard)
  @Author({
    service: SitesService,
  })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.sitesService.remove(id);
  }
}
