import { PaginationDto } from 'src/shared/dtos/pagination.dto';
import { SiteSchema } from '@clayout/interface';
import { DeepPartial } from 'typeorm';
import { z } from 'zod';
import { SiteEntity } from '../entities/site.entity';

export type CreateSiteDto = z.infer<typeof SiteSchema>;

export type UpdateSiteDto = DeepPartial<CreateSiteDto>;

export class PaginateSiteDto extends PaginationDto.createWithConfig<SiteEntity>(
  {
    allowedSortFields: ['created_at', 'updated_at', 'last_published_at'],
    allowedFilterFields: ['created_at', 'updated_at', 'id', 'category'],
  },
) {}
