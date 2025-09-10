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
import { SiteBlocksService } from './blocks.service';
import { Roles } from 'src/users/decorators/role.decorator';
import { UserRoleWeights } from 'src/users/constants/role.const';
import { ZodValidationPipe } from 'src/shared/pipes/zod.pipe';
import {
  CreateSiteBlockDto,
  SiteBlockSchema,
  UpdateSiteBlockDto,
} from '@clayout/interface';

@Roles({ minWeight: UserRoleWeights.User })
@Controller('sites/:siteId/pages/:pageId/blocks')
export class SiteBlocksController {
  constructor(private readonly siteBlocksService: SiteBlocksService) {}

  @Post()
  create(
    @Param('siteId', ParseIntPipe) siteId: number,
    @Param('pageId', ParseIntPipe) pageId: number,
    @Body(new ZodValidationPipe(SiteBlockSchema))
    createSiteBlockDto: CreateSiteBlockDto,
  ) {
    return this.siteBlocksService.create(createSiteBlockDto, siteId, pageId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.siteBlocksService.getById({ id });
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(SiteBlockSchema))
    updateSiteBlockDto: UpdateSiteBlockDto,
  ) {
    return this.siteBlocksService.update(id, updateSiteBlockDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.siteBlocksService.delete(id);
  }
}
