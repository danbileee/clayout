import { Module } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { AssetsController } from './assets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetEntity } from './entities/asset.entity';
import { PaginationService } from 'src/shared/services/pagination.service';
import { UploaderService } from 'src/shared/services/uploader.service';

@Module({
  imports: [TypeOrmModule.forFeature([AssetEntity])],
  controllers: [AssetsController],
  providers: [AssetsService, PaginationService, UploaderService],
})
export class AssetsModule {}
