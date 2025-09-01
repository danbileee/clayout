import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SitePageEntity } from '../entities/site-page.entity';
import { Repository } from 'typeorm';
import { CreateSitePageDto, UpdateSitePageDto } from '@clayout/interface';

@Injectable()
export class SitePagesService {
  constructor(
    @InjectRepository(SitePageEntity)
    private readonly sitesPagesRepository: Repository<SitePageEntity>,
  ) {}

  async create(
    createSitePageDto: CreateSitePageDto,
    siteId: number,
  ): Promise<{ page: SitePageEntity }> {
    const createdSitePage = this.sitesPagesRepository.create({
      ...createSitePageDto,
      site: {
        id: siteId,
      },
    });
    const savedSitePage = await this.sitesPagesRepository.save(createdSitePage);

    return { page: savedSitePage };
  }

  async getById({
    id,
  }: Pick<SitePageEntity, 'id'>): Promise<{ page: SitePageEntity }> {
    const matchedSitePage = await this.sitesPagesRepository.findOne({
      where: {
        id,
      },
      relations: {
        site: true,
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
    updateSitePageDto: UpdateSitePageDto,
  ): Promise<{ page: SitePageEntity }> {
    const matchedSitePage = await this.sitesPagesRepository.findOne({
      where: {
        id,
      },
    });

    if (!matchedSitePage) {
      throw new BadRequestException(`Page not found`);
    }

    const updatedSitePage = await this.sitesPagesRepository.save({
      ...matchedSitePage,
      ...updateSitePageDto,
    });

    return { page: updatedSitePage };
  }

  async delete(id: number): Promise<{ id: number }> {
    await this.sitesPagesRepository.delete({ id });

    return { id };
  }
}
