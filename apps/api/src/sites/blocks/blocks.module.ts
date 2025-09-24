import { Module } from '@nestjs/common';
import { SiteBlocksService } from './blocks.service';
import { SiteBlocksController } from './blocks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SiteBlockEntity } from '../entities/site-block.entity';
import { EnrichBlockPipe } from './pipes/enrich-block.pipe';
import { ReorderService } from 'src/shared/services/reorder.service';

@Module({
  imports: [TypeOrmModule.forFeature([SiteBlockEntity])],
  controllers: [SiteBlocksController],
  providers: [SiteBlocksService, EnrichBlockPipe, ReorderService],
})
export class SiteBlocksModule {}
