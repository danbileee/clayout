import { Test, TestingModule } from '@nestjs/testing';
import { SitesService } from './sites.service';
import { createMockRepositoryProvider } from '../../test/test-utils';
import { SiteEntity } from './entities/site.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('SitesService', () => {
  let service: SitesService;
  let sitesRepository: jest.Mocked<Repository<SiteEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SitesService, createMockRepositoryProvider(SiteEntity)],
    }).compile();

    service = module.get<SitesService>(SitesService);
    sitesRepository = module.get(getRepositoryToken(SiteEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
