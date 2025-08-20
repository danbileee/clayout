import { Module } from '@nestjs/common';
import { SitesService } from './sites.service';
import { SitesController } from './sites.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SiteEntity } from './entities/site.entity';
import { SiteReleaseEntity } from './entities/site-release.entity';
import { SiteDomainEntity } from './entities/site-domain.entity';
import { PaginationService } from 'src/shared/services/pagination.service';
import { SitePageEntity } from './entities/site-page.entity';
import { SiteBlockEntity } from './entities/site-block.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SiteEntity,
      SitePageEntity,
      SiteBlockEntity,
      SiteReleaseEntity,
      SiteDomainEntity,
    ]),
  ],
  controllers: [SitesController],
  providers: [SitesService, PaginationService],
})
export class SitesModule {}
