import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SitePageEntity } from '../entities/site-page.entity';
import { Repository, Not, In } from 'typeorm';
import { ReorderService } from 'src/shared/services/reorder.service';
import {
  CreateSitePageDto,
  ReorderDto,
  UpdateSitePageDto,
} from '@clayout/interface';
import { SitePageErrors } from '@clayout/interface';
import {
  isPostgresError,
  PostgresErrorCode,
} from 'src/shared/utils/isPostgresError';
import { SiteBlocksService } from '../blocks/blocks.service';

@Injectable()
export class SitePagesService {
  constructor(
    @InjectRepository(SitePageEntity)
    private readonly sitesPagesRepository: Repository<SitePageEntity>,
    private readonly reorderService: ReorderService,
    private readonly siteBlocksService: SiteBlocksService,
  ) {}

  async create(
    createSitePageDto: CreateSitePageDto,
    siteId: number,
  ): Promise<{ page: SitePageEntity }> {
    /**
     * slug
     */
    if (createSitePageDto.slug) {
      const slugExists = await this.sitesPagesRepository.exists({
        where: {
          slug: createSitePageDto.slug,
          site: { id: siteId },
        },
      });

      if (slugExists) {
        throw new BadRequestException(
          SitePageErrors['site-page.duplicate-slug'],
        );
      }
    }

    /**
     * isHome
     */
    if (typeof createSitePageDto.isHome === 'boolean') {
      if (createSitePageDto.isHome === true) {
        const homeExists = await this.sitesPagesRepository.exists({
          where: { isHome: true, site: { id: siteId } },
        });

        if (homeExists) {
          throw new BadRequestException(
            SitePageErrors['site-page.existing-homepage'],
          );
        }
      }
    }

    /**
     * isVisible
     */
    if (
      createSitePageDto.isHome === true &&
      createSitePageDto.isVisible === false
    ) {
      throw new BadRequestException(
        SitePageErrors['site-page.home-should-be-visible'],
      );
    }

    const createdSitePage = this.sitesPagesRepository.create({
      ...createSitePageDto,
      site: {
        id: siteId,
      },
    });

    try {
      const savedSitePage =
        await this.sitesPagesRepository.save(createdSitePage);
      return { page: savedSitePage };
    } catch (error: unknown) {
      if (
        isPostgresError(error) &&
        error.driverError.code === PostgresErrorCode.UniqueViolation
      ) {
        throw new BadRequestException(
          SitePageErrors['site-page.duplicate-slug'],
        );
      }
      throw error;
    }
  }

  async getById({
    id,
  }: Pick<SitePageEntity, 'id'>): Promise<{ page: SitePageEntity }> {
    const matchedSitePage = await this.sitesPagesRepository.findOne({
      where: {
        id,
      },
      relations: {
        site: {
          author: true,
        },
        blocks: true,
      },
    });

    if (!matchedSitePage) {
      throw new BadRequestException(`Page not found`);
    }

    return { page: matchedSitePage };
  }

  async update(
    id: number,
    dto: UpdateSitePageDto,
    options?: {
      replace?: boolean;
    },
  ): Promise<{ page: SitePageEntity }> {
    const { replace = false } = options ?? {};

    const matchedSitePage = await this.sitesPagesRepository.findOne({
      where: {
        id,
      },
      relations: { site: true },
    });

    if (!matchedSitePage) {
      throw new BadRequestException(`Page not found`);
    }

    /**
     * slug
     */
    if (dto.slug) {
      const slugExists = await this.sitesPagesRepository.exists({
        where: {
          slug: dto.slug,
          site: { id: matchedSitePage.site.id },
          id: Not(id),
        },
      });
      if (slugExists) {
        throw new BadRequestException(
          SitePageErrors['site-page.duplicate-slug'],
        );
      }
    }

    /**
     * isHome
     */
    if (typeof dto.isHome === 'boolean') {
      const existingHomePage = await this.sitesPagesRepository.findOne({
        where: {
          isHome: true,
          site: { id: matchedSitePage.site.id },
          id: Not(id),
        },
      });

      if (dto.isHome === true && existingHomePage) {
        throw new BadRequestException(
          SitePageErrors['site-page.existing-homepage'],
        );
      }
      if (
        dto.isHome === false &&
        matchedSitePage.isHome === true &&
        !existingHomePage
      ) {
        throw new BadRequestException(SitePageErrors['site-page.no-homepage']);
      }
    }

    /**
     * isVisible
     */
    if (typeof dto.isVisible === 'boolean') {
      if (dto.isVisible === false && matchedSitePage.isHome) {
        throw new BadRequestException(
          SitePageErrors['site-page.home-should-be-visible'],
        );
      }
    }

    /**
     * Do not allow reordering if this is not replace action
     */
    if (!replace) {
      if (
        typeof dto.order === 'number' &&
        dto.order !== matchedSitePage.order
      ) {
        throw new BadRequestException(
          'Changing page order via update is not allowed. Use the reorder API: POST /sites/:siteId/pages/reorder',
        );
      }

      for (const block of dto.blocks) {
        const { block: matchedBlock } = await this.siteBlocksService.getById({
          id: block.id,
        });

        if (
          matchedBlock &&
          typeof block.order === 'number' &&
          block.order !== matchedBlock.order
        ) {
          throw new BadRequestException(
            'Changing block order via page update is not allowed. Use the reorder API: POST /sites/:siteId/pages/:pageId/blocks/reorder',
          );
        }
      }
    }

    const { blocks, ...updateSitePageDto } = dto;

    for (const block of blocks) {
      if (!block.id) {
        throw new BadRequestException(
          `Block id is required to save the block changes.`,
        );
      }

      await this.siteBlocksService.update(block.id, block, { replace });
    }

    try {
      const updatedSitePage = await this.sitesPagesRepository.save({
        ...matchedSitePage,
        ...updateSitePageDto,
        meta: updateSitePageDto.meta
          ? { ...matchedSitePage.meta, ...updateSitePageDto.meta }
          : matchedSitePage.meta,
        id,
      });
      return { page: updatedSitePage };
    } catch (error: unknown) {
      if (
        isPostgresError(error) &&
        error.driverError.code === PostgresErrorCode.UniqueViolation
      ) {
        throw new BadRequestException(
          SitePageErrors['site-page.duplicate-slug'],
        );
      }
      throw error;
    }
  }

  async changeHome({
    siteId,
    prevPageId,
    newPageId,
  }: {
    siteId: number;
    prevPageId: number;
    newPageId: number;
  }): Promise<boolean> {
    const matchedPrevSitePage = await this.sitesPagesRepository.findOne({
      where: {
        id: prevPageId,
      },
      relations: { site: true },
    });
    const matchedNewSitePage = await this.sitesPagesRepository.findOne({
      where: {
        id: newPageId,
      },
      relations: { site: true },
    });

    if (!matchedPrevSitePage || !matchedNewSitePage) {
      throw new BadRequestException(`Page not found`);
    }
    if (matchedPrevSitePage.site.id !== matchedNewSitePage.site.id) {
      throw new BadRequestException(`Pages must belong to the same site`);
    }

    await this.sitesPagesRepository.manager.transaction(async (manager) => {
      const pagesInSite = await manager.find(SitePageEntity, {
        where: { site: { id: siteId } },
        select: ['id'],
      });
      const pageIds = pagesInSite.map((p) => p.id);

      if (pageIds.length > 0) {
        await manager.update(
          SitePageEntity,
          { id: In(pageIds) },
          { isHome: false },
        );
      }

      await manager.update(
        SitePageEntity,
        { id: newPageId },
        { isHome: true, isVisible: true },
      );
    });

    return true;
  }

  async delete(id: number): Promise<{ id: number }> {
    await this.sitesPagesRepository.delete({ id });

    return { id };
  }

  async reorder({
    sourceId,
    targetId,
  }: ReorderDto): Promise<{ success: true }> {
    if (sourceId === targetId) {
      return { success: true };
    }

    const source = await this.sitesPagesRepository.findOne({
      where: { id: sourceId },
      relations: { site: true },
    });
    const target = await this.sitesPagesRepository.findOne({
      where: { id: targetId },
      relations: { site: true },
    });

    if (!source || !target) {
      throw new BadRequestException('Source or target page not found');
    }
    if (source.site.id !== target.site.id) {
      throw new BadRequestException('Pages must belong to the same site');
    }

    await this.reorderService.reorderWithinScope(
      this.sitesPagesRepository,
      SitePageEntity,
      { site: { id: source.site.id } },
      sourceId,
      targetId,
    );

    return { success: true };
  }
}
