import { Module } from '@nestjs/common';
import { SitePagesService } from './pages.service';
import { SitePagesController } from './pages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SitePageEntity } from '../entities/site-page.entity';
import { ReorderService } from 'src/shared/services/reorder.service';
import { SiteBlocksService } from '../blocks/blocks.service';
import { SiteBlockEntity } from '../entities/site-block.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SitePageEntity, SiteBlockEntity])],
  controllers: [SitePagesController],
  providers: [SitePagesService, SiteBlocksService, ReorderService],
})
export class SitePagesModule {}
