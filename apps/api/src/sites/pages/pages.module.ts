import { Module } from '@nestjs/common';
import { SitePagesService } from './pages.service';
import { SitePagesController } from './pages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SitePageEntity } from '../entities/site-page.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SitePageEntity])],
  controllers: [SitePagesController],
  providers: [SitePagesService],
})
export class SitePagesModule {}
