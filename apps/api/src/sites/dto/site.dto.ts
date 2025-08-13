import { SiteSchema } from '@clayout/interface';
import { DeepPartial } from 'typeorm';
import { z } from 'zod';

export type CreateSiteDto = z.infer<typeof SiteSchema>;

export type UpdateSiteDto = DeepPartial<CreateSiteDto>;
