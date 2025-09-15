import { BadRequestException, Inject, Injectable, Scope } from '@nestjs/common';
import { PipeTransform } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { SiteBlocksService } from '../blocks.service';
import { SiteBlockSchema, UpdateSiteBlockDto } from '@clayout/interface';

@Injectable({ scope: Scope.REQUEST })
export class EnrichBlockPipe
  implements PipeTransform<unknown, Promise<UpdateSiteBlockDto>>
{
  constructor(
    private readonly siteBlocksService: SiteBlocksService,
    @Inject(REQUEST) private readonly request: any,
  ) {}

  async transform(value: UpdateSiteBlockDto): Promise<UpdateSiteBlockDto> {
    const params = this.request?.params ?? {};
    const id = Number(params.id);

    if (!id || Number.isNaN(id)) {
      return value;
    }

    const { block } = await this.siteBlocksService.getById({ id });

    const merged = { ...block, ...value };
    const result = SiteBlockSchema.safeParse(merged);

    if (!result.success) throw new BadRequestException(result.error.flatten());

    return result.data;
  }
}
