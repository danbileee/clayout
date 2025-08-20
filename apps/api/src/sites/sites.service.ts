import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSiteDto, UpdateSiteDto } from './dto/site.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pagination } from '@clayout/interface';
import { AuthorService } from 'src/shared/services/author.service';
import { PaginationService } from 'src/shared/services/pagination.service';
import { SiteEntity } from './entities/site.entity';
import { PaginateSiteDto } from './dto/site.dto';
import { SitePageEntity } from './entities/site-page.entity';
import { SiteBlockEntity } from './entities/site-block.entity';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class SitesService implements AuthorService {
  constructor(
    private readonly paginationService: PaginationService,
    @InjectRepository(SiteEntity)
    private readonly sitesRepository: Repository<SiteEntity>,
    @InjectRepository(SitePageEntity)
    private readonly sitesPagesRepository: Repository<SitePageEntity>,
    @InjectRepository(SiteBlockEntity)
    private readonly sitesBlocksRepository: Repository<SiteBlockEntity>,
  ) {}

  async create(
    user: UserEntity,
    dto: CreateSiteDto,
  ): Promise<{ site: SiteEntity }> {
    const { pages, ...restSite } = dto;

    const createdSite = this.sitesRepository.create({
      ...restSite,
      author: user,
    });
    const savedSite = await this.sitesRepository.save(createdSite);

    for (const page of pages) {
      const { blocks, ...restPage } = page;
      const createdPage = this.sitesPagesRepository.create({
        ...restPage,
        site: createdSite,
      });
      await this.sitesPagesRepository.save(createdPage);

      for (const block of blocks) {
        const createdBlock = this.sitesBlocksRepository.create({
          ...block,
          site: createdSite,
          page: createdPage,
        });
        await this.sitesBlocksRepository.save(createdBlock);
      }
    }

    const finalSite = await this.sitesRepository.findOne({
      where: { id: savedSite.id },
      relations: {
        author: true,
        pages: {
          blocks: true,
        },
      },
    });

    return { site: finalSite };
  }

  async paginate(
    userId: number,
    dto: PaginateSiteDto,
  ): Promise<{ results: Pagination<SiteEntity> }> {
    const results = await this.paginationService.paginate<SiteEntity>({
      paginationDto: dto,
      repository: this.sitesRepository,
      findManyOptions: {
        where: {
          author: { id: userId },
        },
        relations: {
          author: true,
        },
      },
      path: 'sites',
    });

    return {
      results,
    };
  }

  async getById({ id }: Pick<SiteEntity, 'id'>): Promise<{ site: SiteEntity }> {
    const site = await this.sitesRepository.findOne({
      where: { id },
      relations: {
        author: true,
        pages: {
          blocks: true,
        },
      },
    });

    if (!site) throw new NotFoundException(`Site not found`);

    return { site };
  }

  async update(id: number, dto: UpdateSiteDto): Promise<{ site: SiteEntity }> {
    const matchedSite = await this.sitesRepository.findOne({
      where: {
        id,
      },
    });

    const { pages, ...restSite } = dto;

    for (const page of pages) {
      const { blocks, ...restPage } = page;

      if (!page.id) {
        throw new BadRequestException(
          `Page id is required to save the page changes.`,
        );
      }

      for (const block of blocks) {
        if (!block.id) {
          throw new BadRequestException(
            `Block id is required to save the block changes.`,
          );
        }

        const matchedBlock = await this.sitesBlocksRepository.findOne({
          where: {
            id: block.id,
          },
        });
        await this.sitesBlocksRepository.save({
          ...matchedBlock,
          ...block,
        });
      }

      const matchedPage = await this.sitesPagesRepository.findOne({
        where: {
          id: page.id,
        },
      });

      await this.sitesPagesRepository.save({
        ...matchedPage,
        ...restPage,
      });
    }

    const newSite: SiteEntity = await this.sitesRepository.save({
      id,
      ...matchedSite,
      ...restSite,
    });
    const finalSite = await this.sitesRepository.findOne({
      where: { id: newSite.id },
      relations: {
        author: true,
        pages: {
          blocks: true,
        },
      },
    });

    return { site: finalSite };
  }

  async delete(id: number): Promise<{ id: number }> {
    await this.sitesRepository.delete({ id });

    return { id };
  }

  async isAuthor(userId: number, resourceId: number): Promise<boolean> {
    return this.sitesRepository.exists({
      where: {
        id: resourceId,
        author: {
          id: userId,
        },
      },
    });
  }
}
