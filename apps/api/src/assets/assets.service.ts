import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationService } from 'src/shared/services/pagination.service';
import { AssetEntity } from './entities/asset.entity';
import { Repository } from 'typeorm';
import {
  CreateAssetDto,
  PaginateAssetDto,
  Pagination,
  UpdateAssetDto,
  UploadAssetInputDto,
} from '@clayout/interface';
import { UploaderService } from 'src/shared/services/uploader.service';

@Injectable()
export class AssetsService {
  constructor(
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

  async getById(id: number): Promise<{ asset: AssetEntity }> {
    const matchedAsset = await this.assetsRepository.findOne({ where: { id } });

    if (!matchedAsset) {
      throw new BadRequestException(`Asset not found`);
    }

    return { asset: matchedAsset };
  }

  async update(
    id: number,
    dto: UpdateAssetDto,
  ): Promise<{ asset: AssetEntity }> {
    const matchedAsset = await this.assetsRepository.findOne({
      where: { id },
    });

    if (!matchedAsset) {
      throw new BadRequestException(`Asset not found`);
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
