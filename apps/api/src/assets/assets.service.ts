import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationService } from 'src/shared/services/pagination.service';
import { AssetEntity } from './entities/asset.entity';
import { DataSource, Repository } from 'typeorm';
import {
  AssetTargetTypes,
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
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class AssetsService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly paginationService: PaginationService,
    private readonly uploaderService: UploaderService,
    @InjectRepository(AssetEntity)
    private readonly assetsRepository: Repository<AssetEntity>,
  ) {}

  async paginate(
    userId: number,
    dto: PaginateAssetDto,
  ): Promise<{ results: Pagination<AssetEntity> }> {
    const results = await this.paginationService.paginate<AssetEntity>({
      paginationDto: dto,
      repository: this.assetsRepository,
      findManyOptions: {
        where: {
          author: { id: userId },
        },
        relations: {
          author: true,
        },
      },
      path: 'assets',
    });

    return { results };
  }

  async getSignedUrl(dto: UploadAssetInputDto): Promise<{ signedUrl: string }> {
    const signedUrl = await this.uploaderService.getSignedUrl({
      Key: dto.key,
      ContentType: dto.contentType,
    });

    return { signedUrl };
  }

  async create(
    user: UserEntity,
    dto: CreateAssetDto,
  ): Promise<{ asset: AssetEntity }> {
    const createdAsset = this.assetsRepository.create({
      ...dto,
      author: user,
    });
    const savedAsset = await this.assetsRepository.save(createdAsset);

    return { asset: savedAsset };
  }

  async getById<T extends SiteEntity | SitePageEntity | SiteBlockEntity>(
    id: number,
  ): Promise<{ asset: AssetEntity & { target: T } }> {
    const matchedAsset = await this.assetsRepository.findOne({ where: { id } });

    if (!matchedAsset) {
      throw new NotFoundException(`Asset not found`);
    }

    let target: T;

    switch (matchedAsset.targetType) {
      case AssetTargetTypes.Site:
        const result = await this.dataSource.getRepository(SiteEntity).findOne({
          where: { id: matchedAsset.targetId },
        });
        if (!result) {
          throw new NotFoundException(
            `No matched target exists for given target id: ${matchedAsset.targetId}`,
          );
        }
        target = result as T;
        break;
      case AssetTargetTypes.None:
        target = null;
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
