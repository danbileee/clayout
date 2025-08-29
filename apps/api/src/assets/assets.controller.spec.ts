import { Test, TestingModule } from '@nestjs/testing';
import { AssetsController } from './assets.controller';
import { AssetsService } from './assets.service';
import { createMockService } from '../../test/jest-setup';

describe('AssetsController', () => {
  let controller: AssetsController;
  let mockAssetsService: Partial<AssetsService>;

  beforeEach(async () => {
    mockAssetsService = createMockService<AssetsService>({
      paginate: jest.fn(),
      getSignedUrl: jest.fn(),
      create: jest.fn(),
      getById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    });

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssetsController],
      providers: [
        {
          provide: AssetsService,
          useValue: mockAssetsService,
        },
      ],
    }).compile();

    controller = module.get<AssetsController>(AssetsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
