import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Body,
} from '@nestjs/common';
import { AssetsService } from './assets.service';
import { AssetEntity } from './entities/asset.entity';
import {
  AssetSchema,
  AssetUploadInputSchema,
  CreateAssetDto,
  PaginateAssetDto,
  PaginateAssetsSchema,
  Pagination,
  UpdateAssetDto,
  UploadAssetInputDto,
} from '@clayout/interface';
import { ZodValidationPipe } from 'src/shared/pipes/zod.pipe';

@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get()
  async getAssets(
    @Query(new ZodValidationPipe(PaginateAssetsSchema))
    paginateAssetDto: PaginateAssetDto,
  ): Promise<Pagination<AssetEntity>> {
    return await this.assetsService.paginate(paginateAssetDto);
  }

  @Get('signed-url')
  async getAssetSignedUrl(
    @Query(new ZodValidationPipe(AssetUploadInputSchema))
    uploadAssetInputDto: UploadAssetInputDto,
  ): Promise<{ signedUrl: string }> {
    return await this.assetsService.getSignedUrl(uploadAssetInputDto);
  }

  @Post()
  async postAsset(
    @Body(new ZodValidationPipe(AssetSchema)) createAssetDto: CreateAssetDto,
  ): Promise<{ asset: AssetEntity }> {
    return await this.assetsService.create(createAssetDto);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ asset: AssetEntity }> {
    return await this.assetsService.getById(id);
  }

  @Patch(':id')
  async updatedAsset(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(AssetSchema.optional()))
    updatedAssetDto: UpdateAssetDto,
  ): Promise<{ asset: AssetEntity }> {
    return await this.assetsService.update(id, updatedAssetDto);
  }

  @Delete(':id')
  async deleteAsset(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ id: number }> {
    return await this.assetsService.delete(id);
  }
}
