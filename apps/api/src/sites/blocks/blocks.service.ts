import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SiteBlockEntity } from '../entities/site-block.entity';
import { Not, Repository } from 'typeorm';
import { ReorderService } from 'src/shared/services/reorder.service';
import {
  CreateSiteBlockDto,
  ReorderDto,
  SiteBlockErrors,
  SiteBlockSchema,
  UpdateSiteBlockDto,
} from '@clayout/interface';
import {
  isPostgresError,
  PostgresErrorCode,
} from 'src/shared/utils/isPostgresError';
import { randomBytes } from 'crypto';

@Injectable()
export class SiteBlocksService {
  constructor(
    @InjectRepository(SiteBlockEntity)
    private readonly sitesBlocksRepository: Repository<SiteBlockEntity>,
    private readonly reorderService: ReorderService,
  ) {}

  async create(
    createSiteBlockDto: CreateSiteBlockDto,
    siteId: number,
    pageId: number,
  ): Promise<{ block: SiteBlockEntity }> {
    /**
     * slug
     */
    if (createSiteBlockDto.slug) {
      const slugExists = await this.sitesBlocksRepository.exists({
        where: {
          slug: createSiteBlockDto.slug,
          site: { id: siteId },
          page: { id: pageId },
        },
      });

      if (slugExists) {
        throw new BadRequestException(
          SiteBlockErrors['site-block.duplicate-slug'],
        );
      }
    }

    const existingCount = await this.sitesBlocksRepository.count({
      where: { page: { id: pageId } },
    });

    const createdSiteBlock = this.sitesBlocksRepository.create({
      ...createSiteBlockDto,
      order: existingCount,
      site: { id: siteId },
      page: { id: pageId },
    });

    try {
      const savedSiteBlock =
        await this.sitesBlocksRepository.save(createdSiteBlock);
      return { block: savedSiteBlock };
    } catch (error: unknown) {
      if (
        isPostgresError(error) &&
        error.driverError.code === PostgresErrorCode.UniqueViolation
      ) {
        throw new BadRequestException(
          SiteBlockErrors['site-block.duplicate-slug'],
        );
      }
      throw error;
    }
  }

  async getById({
    id,
  }: Pick<SiteBlockEntity, 'id'>): Promise<{ block: SiteBlockEntity }> {
    const matchedSiteBlock = await this.sitesBlocksRepository.findOne({
      where: {
        id,
      },
      relations: {
        site: {
          author: true,
        },
        page: true,
      },
    });

    if (!matchedSiteBlock) {
      throw new BadRequestException(`Block not found`);
    }

    return { block: matchedSiteBlock };
  }

  async update(
    id: number,
    updateSiteBlockDto: UpdateSiteBlockDto,
    options?: {
      replace?: boolean;
    },
  ): Promise<{ block: SiteBlockEntity }> {
    const { replace = false } = options ?? {};

    const matchedSiteBlock = await this.sitesBlocksRepository.findOne({
      where: {
        id,
      },
      relations: { site: true },
    });

    if (!matchedSiteBlock) {
      throw new BadRequestException(`Block not found`);
    }

    // Disallow direct order updates; instruct to use reorder API
    if (
      !replace &&
      typeof updateSiteBlockDto.order === 'number' &&
      updateSiteBlockDto.order !== matchedSiteBlock.order
    ) {
      throw new BadRequestException(
        'Changing block order via update is not allowed. Use the reorder API: POST /sites/:siteId/pages/:pageId/blocks/reorder',
      );
    }

    /**
     * slug
     */
    if (updateSiteBlockDto.slug) {
      const slugExists = await this.sitesBlocksRepository.exists({
        where: {
          slug: updateSiteBlockDto.slug,
          site: { id: matchedSiteBlock.site.id },
          id: Not(id),
        },
      });
      if (slugExists) {
        console.log('catched! dto slug');
        throw new BadRequestException(
          SiteBlockErrors['site-block.duplicate-slug'],
        );
      }
    }

    try {
      const updatedSiteBlock = await this.sitesBlocksRepository.save({
        ...matchedSiteBlock,
        ...updateSiteBlockDto,
        data: updateSiteBlockDto.data
          ? { ...matchedSiteBlock.data, ...updateSiteBlockDto.data }
          : matchedSiteBlock.data,
        style: updateSiteBlockDto.style
          ? { ...matchedSiteBlock.style, ...updateSiteBlockDto.style }
          : matchedSiteBlock.style,
        containerStyle: updateSiteBlockDto.containerStyle
          ? {
              ...matchedSiteBlock.containerStyle,
              ...updateSiteBlockDto.containerStyle,
            }
          : matchedSiteBlock.containerStyle,
        id,
      });
      return { block: updatedSiteBlock };
    } catch (error: unknown) {
      if (
        isPostgresError(error) &&
        error.driverError.code === PostgresErrorCode.UniqueViolation
      ) {
        console.log('catched! postgres error');
        throw new BadRequestException(
          SiteBlockErrors['site-block.duplicate-slug'],
        );
      }
      throw error;
    }
  }

  async reorder({
    sourceId,
    targetId,
  }: ReorderDto): Promise<{ success: true }> {
    if (sourceId === targetId) {
      return { success: true };
    }

    const source = await this.sitesBlocksRepository.findOne({
      where: { id: sourceId },
      relations: { page: true },
    });
    const target = await this.sitesBlocksRepository.findOne({
      where: { id: targetId },
      relations: { page: true },
    });

    if (!source || !target) {
      throw new BadRequestException('Source or target block not found');
    }
    if (source.page.id !== target.page.id) {
      throw new BadRequestException(
        'Blocks must be on the same page to reorder',
      );
    }

    await this.reorderService.reorderWithinScope(
      this.sitesBlocksRepository,
      SiteBlockEntity,
      { page: { id: source.page.id } },
      sourceId,
      targetId,
    );

    return { success: true };
  }

  async delete(id: number): Promise<{ id: number }> {
    await this.sitesBlocksRepository.delete({ id });

    return { id };
  }

  async duplicate(
    siteId: number,
    pageId: number,
    blockId: number,
  ): Promise<{ block: SiteBlockEntity }> {
    const matchedBlock = await this.sitesBlocksRepository.findOne({
      where: {
        id: blockId,
      },
    });
    const parsed = SiteBlockSchema.safeParse(matchedBlock);

    if (parsed.error) {
      throw new BadRequestException(
        `DUPLICATION FAILED: Block data is invalid`,
      );
    }

    const { id, slug, order, ...blockData } = parsed.data;
    const existingCount = await this.sitesBlocksRepository.count({
      where: { page: { id: pageId } },
    });
    const { block } = await this.create(
      {
        ...blockData,
        slug: `${slug}-${randomBytes(4).toString('hex')}`,
        order: existingCount,
      },
      siteId,
      pageId,
    );

    return { block };
  }

  async validateSlug({
    siteId,
    pageId,
    slug,
  }: {
    siteId: number;
    pageId: number;
    slug: string;
  }): Promise<boolean> {
    return await this.sitesBlocksRepository.exists({
      where: {
        slug,
        site: { id: siteId },
        page: { id: pageId },
      },
    });
  }
}
