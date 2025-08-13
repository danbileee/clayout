import { Module } from '@nestjs/common';
import { SitesService } from './sites.service';
import { SitesController } from './sites.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SiteEntity } from './entities/site.entity';
import { SiteReleaseEntity } from './entities/site-release.entity';
import { SiteDomainEntity } from './entities/site-domain.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SiteEntity, SiteReleaseEntity, SiteDomainEntity]),
  ],
  controllers: [SitesController],
  providers: [SitesService],
})
export class SitesModule {}
