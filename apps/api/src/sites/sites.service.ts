import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateSiteDto,
  Pagination,
  UpdateSiteDto,
  PaginateSiteDto,
  SiteStatuses,
  SiteDomainStatuses,
} from '@clayout/interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthorService } from 'src/shared/services/author.service';
import { PaginationService } from 'src/shared/services/pagination.service';
import { SiteEntity } from './entities/site.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { UploaderService } from 'src/shared/services/uploader.service';
import { generateSiteFiles } from './utils/generateSiteFiles';
import { ConfigService } from '@nestjs/config';
import { EnvKeys } from 'src/shared/constants/env.const';
import { SiteReleaseEntity } from './entities/site-release.entity';
import { randomBytes } from 'crypto';
import { SiteFile } from './interfaces/site.interface';
import { SiteDomainEntity } from './entities/site-domain.entity';
import { SitePagesService } from './pages/pages.service';
import { SiteBlocksService } from './blocks/blocks.service';

@Injectable()
export class SitesService implements AuthorService {
  constructor(
    private readonly paginationService: PaginationService,
    private readonly uploaderService: UploaderService,
    private readonly configService: ConfigService,
    private readonly sitePagesService: SitePagesService,
    private readonly siteBlocksService: SiteBlocksService,
    @InjectRepository(SiteEntity)
    private readonly sitesRepository: Repository<SiteEntity>,
    @InjectRepository(SiteReleaseEntity)
    private readonly sitesReleasesRepository: Repository<SiteReleaseEntity>,
    @InjectRepository(SiteDomainEntity)
    private readonly sitesDomainsRepository: Repository<SiteDomainEntity>,
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
      const { page: createdPage } = await this.sitePagesService.create(
        restPage,
        createdSite.id,
      );

      for (const block of blocks) {
        await this.siteBlocksService.create(
          block,
          createdSite.id,
          createdPage.id,
        );
      }
    }

    const createdDomain = this.sitesDomainsRepository.create({
      hostname: `${savedSite.slug}.clayout.app`,
      status: SiteDomainStatuses.Pending,
      isPrimary: true,
      site: savedSite,
    });
    await this.sitesDomainsRepository.save(createdDomain);

    const finalSite = await this.sitesRepository.findOne({
      where: { id: savedSite.id },
      relations: {
        author: true,
        pages: {
          blocks: true,
        },
      },
      order: {
        pages: {
          order: 'ASC',
          blocks: {
            order: 'ASC',
          },
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
      order: {
        pages: {
          order: 'ASC',
          blocks: {
            order: 'ASC',
          },
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

    const { pages, ...updateSiteDto } = dto;

    for (const page of pages) {
      const { blocks, ...restPage } = page;

      if (!page.id) {
        throw new BadRequestException(
          `Page id is required to save the page changes.`,
        );
      }

      const { page: matchedSitePage } = await this.sitePagesService.getById({
        id: page.id,
      });

      if (
        typeof page.order === 'number' &&
        page.order !== matchedSitePage.order
      ) {
        throw new BadRequestException(
          'Changing page order via update is not allowed. Use the reorder API: POST /sites/:siteId/pages/reorder',
        );
      }

      for (const block of blocks) {
        const { block: matchedBlock } = await this.siteBlocksService.getById({
          id: block.id,
        });

        if (
          matchedBlock &&
          typeof block.order === 'number' &&
          block.order !== matchedBlock.order
        ) {
          throw new BadRequestException(
            'Changing block order via site update is not allowed. Use the reorder API: POST /sites/:siteId/pages/:pageId/blocks/reorder',
          );
        }

        if (!block.id) {
          throw new BadRequestException(
            `Block id is required to save the block changes.`,
          );
        }

        await this.siteBlocksService.update(block.id, block);
      }

      if (typeof restPage.order === 'number') {
        throw new BadRequestException(
          'Changing page order via site update is not allowed. Use the reorder API: POST /sites/:siteId/pages/reorder',
        );
      }

      await this.sitePagesService.update(page.id, restPage);
    }

    const updatedSite: SiteEntity = await this.sitesRepository.save({
      ...matchedSite,
      ...updateSiteDto,
      meta: updateSiteDto.meta
        ? { ...matchedSite.meta, ...updateSiteDto.meta }
        : matchedSite.meta,
      id,
    });
    const finalSite = await this.sitesRepository.findOne({
      where: { id: updatedSite.id },
      relations: {
        author: true,
        pages: {
          blocks: true,
        },
      },
      order: {
        pages: {
          order: 'ASC',
          blocks: {
            order: 'ASC',
          },
        },
      },
    });

    return { site: finalSite };
  }

  async delete(id: number): Promise<{ id: number }> {
    await this.sitesRepository.delete({ id });

    return { id };
  }

  async publish(id: number): Promise<{ site: SiteEntity }> {
    const site = await this.sitesRepository.findOne({
      where: {
        id,
      },
      relations: {
        author: true,
        pages: {
          blocks: true,
        },
        domains: true,
      },
      order: {
        pages: {
          order: 'ASC',
          blocks: {
            order: 'ASC',
          },
        },
      },
    });

    if (!site) {
      throw new NotFoundException(`Site not found`);
    }

    const domain = await this.sitesDomainsRepository.findOne({
      where: {
        site: {
          id: site.id,
        },
        isPrimary: true,
      },
    });
    const favicon = await this.generateFavicon(site.id, site.meta?.faviconPath);
    const files = await generateSiteFiles(site, domain, { favicon });
    const release = await this.createRelease(site, files);

    for (const file of files) {
      await this.uploadBundle({
        file,
        siteId: site.id,
        releaseVersion: release.version,
      });
    }

    const hostnames = [
      ...site.domains.map((domain) => domain.hostname),
      `${site.slug}.clayout.app`,
    ];

    for (const hostname of hostnames) {
      await this.updateKV({
        hostname,
        siteId: site.id,
        releaseVersion: release.version,
      });
    }

    const now = new Date();

    await this.sitesReleasesRepository.save({
      ...release,
      publishedAt: now,
    });
    await this.sitesRepository.save({
      ...site,
      status: SiteStatuses.Published,
      lastPublishedAt: now,
      lastPublishedVersion: release.version,
    });

    const publishedSite = await this.sitesRepository.findOne({
      where: {
        id: site.id,
      },
    });

    return { site: publishedSite };
  }

  async generateFavicon(
    siteId: number,
    faviconPath?: string,
  ): Promise<Buffer | undefined> {
    if (!faviconPath) return;

    try {
      const assetsBucket = this.configService.get(EnvKeys.CF_R2_ASSETS_BUCKET);
      const object = await this.uploaderService.get({
        Bucket: assetsBucket,
        Key: faviconPath,
      });

      if (object.Body) {
        const bytes = await object.Body.transformToByteArray();
        return Buffer.from(bytes);
      }
    } catch (error) {
      console.error('Failed to copy favicon for site:', siteId, error);
    }
  }

  async createRelease(
    site: SiteEntity,
    files: SiteFile[],
  ): Promise<SiteReleaseEntity> {
    const htmlSnapshot = files[0]?.content?.toString();
    const release = this.sitesReleasesRepository.create({
      htmlSnapshot,
      dataSnapshot: site,
      version: randomBytes(6).toString('hex'),
      site,
    });

    return await this.sitesReleasesRepository.save(release);
  }

  async uploadBundle({
    file,
    siteId,
    releaseVersion,
  }: {
    file: SiteFile;
    siteId: number;
    releaseVersion: string;
  }) {
    const bucket = this.configService.get(EnvKeys.CF_R2_BUNDLES_BUCKET);

    if (!bucket) {
      throw new BadRequestException(
        'CF_R2_BUNDLES_BUCKET environment variable is required but not set',
      );
    }

    try {
      await this.uploaderService.upload({
        Bucket: bucket,
        Key: `sites/${siteId}/${releaseVersion}/${file.name}`,
        ContentType: file.contentType,
        Body:
          typeof file.content === 'string'
            ? Buffer.from(file.content)
            : file.content,
      });
    } catch (error) {
      console.error('Failed to upload site bundle:', {
        siteId,
        releaseVersion,
        fileName: file.name,
        error: error.message,
      });
      throw new BadRequestException(
        `Failed to upload site bundle: ${error.message}`,
      );
    }
  }

  async updateKV({
    hostname,
    siteId,
    releaseVersion,
  }: {
    hostname: string;
    siteId: number;
    releaseVersion: string;
  }) {
    const url = `${this.configService.get(EnvKeys.CF_KV_API_HOST)}/${this.configService.get(EnvKeys.CF_KV_SITE_ROUTING_ID)}/values/domain:${hostname}`;
    const body = `${siteId}:${releaseVersion}`;
    const token = this.configService.get(EnvKeys.CF_KV_TOKEN);

    try {
      await fetch(url, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'text/plain',
        },
        body,
      });
    } catch (error) {
      console.error({ error, url, body, token });
    }
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
