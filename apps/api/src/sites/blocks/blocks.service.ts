import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SiteBlockEntity } from '../entities/site-block.entity';
import { Not, Repository } from 'typeorm';
import {
  CreateSiteBlockDto,
  SiteBlockErrors,
  UpdateSiteBlockDto,
} from '@clayout/interface';
import {
  isPostgresError,
  PostgresErrorCode,
} from 'src/shared/utils/isPostgresError';

@Injectable()
export class SiteBlocksService {
  constructor(
    @InjectRepository(SiteBlockEntity)
    private readonly sitesBlocksRepository: Repository<SiteBlockEntity>,
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

    const createdSiteBlock = this.sitesBlocksRepository.create({
      ...createSiteBlockDto,
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
  ): Promise<{ block: SiteBlockEntity }> {
    const matchedSiteBlock = await this.sitesBlocksRepository.findOne({
      where: {
        id,
      },
      relations: { site: true },
    });

    if (!matchedSiteBlock) {
      throw new BadRequestException(`Block not found`);
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
        throw new BadRequestException(
          SiteBlockErrors['site-block.duplicate-slug'],
        );
      }
    }

    try {
      const updatedSiteBlock = await this.sitesBlocksRepository.save({
        ...matchedSiteBlock,
        ...updateSiteBlockDto,
      });
      return { block: updatedSiteBlock };
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

  async delete(id: number): Promise<{ id: number }> {
    await this.sitesBlocksRepository.delete({ id });

    return { id };
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
