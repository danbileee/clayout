import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationService } from 'src/shared/services/pagination.service';
import { AssetEntity } from './entities/asset.entity';
import { DataSource, Repository } from 'typeorm';
import {
  AssetTypes,
  CreateAssetDto,
  PaginateAssetDto,
  Pagination,
  UpdateAssetDto,
  UploadAssetInputDto,
} from '@clayout/interface';
import { UploaderService } from 'src/shared/services/uploader.service';
import { SiteBlockEntity } from 'src/sites/entities/site-block.entity';
import { SitePageEntity } from 'src/sites/entities/site-page.entity';
import { SiteEntity } from 'src/sites/entities/site.entity';

@Injectable()
export class AssetsService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly paginationService: PaginationService,
    private readonly uploaderService: UploaderService,
    @InjectRepository(AssetEntity)
    private readonly assetsRepository: Repository<AssetEntity>,
  ) {}

  async paginate(dto: PaginateAssetDto): Promise<Pagination<AssetEntity>> {
    return this.paginationService.paginate<AssetEntity>({
      paginationDto: dto,
      repository: this.assetsRepository,
      findManyOptions: {},
      path: 'assets',
    });
  }

  async getSignedUrl(dto: UploadAssetInputDto): Promise<{ signedUrl: string }> {
    const signedUrl = await this.uploaderService.getSignedUrl({
      Key: dto.key,
      ContentType: dto.contentType,
    });

    return { signedUrl };
  }

  async create(dto: CreateAssetDto): Promise<{ asset: AssetEntity }> {
    const createdAsset = this.assetsRepository.create(dto);
    const savedAsset = await this.assetsRepository.save(createdAsset);

    return { asset: savedAsset };
  }

  async getById(
    id: number,
  ): Promise<{ asset: AssetEntity & { target: unknown } }> {
    const matchedAsset = await this.assetsRepository.findOne({ where: { id } });

    if (!matchedAsset) {
      throw new NotFoundException(`Asset not found`);
    }

    let target: unknown;

    switch (matchedAsset.targetType) {
      case AssetTypes.Site:
        target = await this.dataSource.getRepository(SiteEntity).findOne({
          where: { id: matchedAsset.targetId },
        });
        break;
      case AssetTypes.SitePage:
        target = await this.dataSource.getRepository(SitePageEntity).findOne({
          where: { id: matchedAsset.targetId },
        });
        break;
      case AssetTypes.SiteBlock:
        target = await this.dataSource.getRepository(SiteBlockEntity).findOne({
          where: { id: matchedAsset.targetId },
        });
        break;
      default:
        throw new NotFoundException(
          `Unknown target type: ${matchedAsset.targetType}`,
        );
    }

    return {
      asset: {
        ...matchedAsset,
        target,
      },
    };
  }

  async update(
    id: number,
    dto: UpdateAssetDto,
  ): Promise<{ asset: AssetEntity }> {
    const matchedAsset = await this.assetsRepository.findOne({
      where: { id },
    });

    if (!matchedAsset) {
      throw new NotFoundException(`Asset not found`);
    }

    const updatedAsset: AssetEntity = {
      ...matchedAsset,
      ...dto,
    };

    const savedAsset = await this.assetsRepository.save(updatedAsset);

    return { asset: savedAsset };
  }

  async delete(id: number): Promise<{ id: number }> {
    await this.assetsRepository.delete({ id });

    return { id };
  }
}
