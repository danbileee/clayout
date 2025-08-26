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
} from '@clayout/interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthorService } from 'src/shared/services/author.service';
import { PaginationService } from 'src/shared/services/pagination.service';
import { SiteEntity } from './entities/site.entity';
import { SitePageEntity } from './entities/site-page.entity';
import { SiteBlockEntity } from './entities/site-block.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { UploaderService } from 'src/shared/services/uploader.service';
import { generateSiteFiles } from './utils/generateSiteFiles';
import { ConfigService } from '@nestjs/config';
import { EnvKeys } from 'src/shared/constants/env.const';
import { SiteReleaseEntity } from './entities/site-release.entity';
import { randomBytes } from 'crypto';
import { SiteFile } from './interfaces/site.interface';

@Injectable()
export class SitesService implements AuthorService {
  constructor(
    private readonly paginationService: PaginationService,
    private readonly uploaderService: UploaderService,
    private readonly configService: ConfigService,
    @InjectRepository(SiteEntity)
    private readonly sitesRepository: Repository<SiteEntity>,
    @InjectRepository(SitePageEntity)
    private readonly sitesPagesRepository: Repository<SitePageEntity>,
    @InjectRepository(SiteBlockEntity)
    private readonly sitesBlocksRepository: Repository<SiteBlockEntity>,
    @InjectRepository(SiteReleaseEntity)
    private readonly sitesReleasesRepository: Repository<SiteReleaseEntity>,
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

  async publish(id: number): Promise<boolean> {
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
    });

    if (!site) {
      throw new NotFoundException(`Site not found`);
    }

    const files = generateSiteFiles(site);
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

    const now = Date.now();

    await this.sitesReleasesRepository.save({
      ...release,
      publishedAt: now,
    });
    await this.sitesRepository.save({
      ...site,
      status: SiteStatuses.Published,
      lastPublishedAt: now,
    });

    return true;
  }

  async createRelease(
    site: SiteEntity,
    files: SiteFile[],
  ): Promise<SiteReleaseEntity> {
    const htmlSnapshot = files[0]?.content?.toString();
    const release = this.sitesReleasesRepository.create({
      htmlSnapshot,
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
    await this.uploaderService.upload({
      Bucket: this.configService.get(EnvKeys.CF_R2_BUNDLES_BUCKET),
      Key: `sites/${siteId}/${releaseVersion}/${file.name}`,
      ContentType: file.contentType,
      Body:
        typeof file.content === 'string'
          ? Buffer.from(file.content)
          : file.content,
    });
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
    const url = `${this.configService.get(EnvKeys.CF_KV_URL)}/${this.configService.get(EnvKeys.CF_KV_SITE_ROUTING_NAME)}/values/domain:${hostname}`;

    await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${this.configService.get(EnvKeys.CF_KV_TOKEN)}`,
        'Content-Type': 'text/plain',
      },
      body: `${siteId}:${releaseVersion}`,
    });
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
