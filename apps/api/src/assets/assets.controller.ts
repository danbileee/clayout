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
import { User } from 'src/users/decorators/user.decorator';
import { UserEntity } from 'src/users/entities/user.entity';

@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get()
  async getAssets(
    @User() user: UserEntity,
    @Query(new ZodValidationPipe(PaginateAssetsSchema))
    paginateAssetDto: PaginateAssetDto,
  ): Promise<{ results: Pagination<AssetEntity> }> {
    return await this.assetsService.paginate(user.id, paginateAssetDto);
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
    @User() user: UserEntity,
    @Body(new ZodValidationPipe(AssetSchema)) createAssetDto: CreateAssetDto,
  ): Promise<{ asset: AssetEntity }> {
    return await this.assetsService.create(user, createAssetDto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<{
    asset: AssetEntity & {
      target: unknown;
    };
  }> {
    return await this.assetsService.getById(id);
  }

  @Patch(':id')
  async updatedAsset(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(AssetSchema.partial()))
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
