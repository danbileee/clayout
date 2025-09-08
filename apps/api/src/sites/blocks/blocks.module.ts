import { Module } from '@nestjs/common';
import { SiteBlocksService } from './blocks.service';
import { SiteBlocksController } from './blocks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SiteBlockEntity } from '../entities/site-block.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SiteBlockEntity])],
  controllers: [SiteBlocksController],
  providers: [SiteBlocksService],
})
export class SiteBlocksModule {}
