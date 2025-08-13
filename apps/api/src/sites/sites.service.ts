import { Injectable } from '@nestjs/common';
import { CreateSiteDto, UpdateSiteDto } from './dto/site.dto';
import { AuthorService } from 'src/shared/services/author.service';
import { InjectRepository } from '@nestjs/typeorm';
import { SiteEntity } from './entities/site.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SitesService implements AuthorService {
  constructor(
    @InjectRepository(SiteEntity)
    private readonly sitesRepository: Repository<SiteEntity>,
  ) {}

  create(createSiteDto: CreateSiteDto) {
    return 'This action adds a new site';
  }

  findAll() {
    return `This action returns all sites`;
  }

  findOne(id: number) {
    return `This action returns a #${id} site`;
  }

  update(id: number, updateSiteDto: UpdateSiteDto) {
    return `This action updates a #${id} site`;
  }

  remove(id: number) {
    return `This action removes a #${id} site`;
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
