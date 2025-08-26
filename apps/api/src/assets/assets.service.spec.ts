import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AssetsService } from './assets.service';
import { AssetEntity } from './entities/asset.entity';
import { PaginationService } from 'src/shared/services/pagination.service';
import { UploaderService } from 'src/shared/services/uploader.service';
import { DataSource } from 'typeorm';
import {
  createMockRepositoryProvider,
  createMockRepository,
} from '../../test/test-utils';

describe('AssetsService', () => {
  let service: AssetsService;
  let mockRepository: ReturnType<typeof createMockRepository>;
  let mockPaginationService: Partial<PaginationService>;
  let mockUploaderService: Partial<UploaderService>;
  let mockDataSource: Partial<DataSource>;

  beforeEach(async () => {
    mockPaginationService = {
      paginate: jest.fn(),
    };

    mockUploaderService = {
      getSignedUrl: jest.fn(),
    };

    mockDataSource = {
      getRepository: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssetsService,
        createMockRepositoryProvider(AssetEntity),
        {
          provide: PaginationService,
          useValue: mockPaginationService,
        },
        {
          provide: UploaderService,
          useValue: mockUploaderService,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<AssetsService>(AssetsService);
    mockRepository = module.get(getRepositoryToken(AssetEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
