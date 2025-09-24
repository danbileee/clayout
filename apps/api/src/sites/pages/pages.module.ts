import { Module } from '@nestjs/common';
import { SitePagesService } from './pages.service';
import { SitePagesController } from './pages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SitePageEntity } from '../entities/site-page.entity';
import { ReorderService } from 'src/shared/services/reorder.service';

@Module({
  imports: [TypeOrmModule.forFeature([SitePageEntity])],
  controllers: [SitePagesController],
  providers: [SitePagesService, ReorderService],
})
export class SitePagesModule {}
