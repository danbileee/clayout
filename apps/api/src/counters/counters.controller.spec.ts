import { Test, TestingModule } from '@nestjs/testing';
import { CountersController } from './counters.controller';
import { CountersService } from './counters.service';
import { createMockService } from '../test/jest-setup';

describe('CountersController', () => {
  let controller: CountersController;
  let mockCountersService: Partial<CountersService>;

  beforeEach(async () => {
    mockCountersService = createMockService<CountersService>({
      getCounters: jest.fn(),
      createCounters: jest.fn(),
      updateCounters: jest.fn(),
    });

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CountersController],
      providers: [
        {
          provide: CountersService,
          useValue: mockCountersService,
        },
      ],
    }).compile();

    controller = module.get<CountersController>(CountersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCounters', () => {
    it('should call service.getCounters with param', async () => {
      const param = 'test-param';
      const expectedResult = 'Hello World~~~~~~~!!!!! test-param';
      (mockCountersService.getCounters as jest.Mock).mockResolvedValue(
        expectedResult,
      );

      const result = await controller.getCounters(param);

      expect(result).toBe(expectedResult);
      expect(mockCountersService.getCounters).toHaveBeenCalledWith(param);
    });
  });

  describe('postCounters', () => {
    it('should call service.createCounters with dto', async () => {
      const dto = { id: 1, value: 'test', count: 0 };
      const expectedResult = { ...dto };
      (mockCountersService.createCounters as jest.Mock).mockResolvedValue(
        expectedResult,
      );

      const result = await controller.postCounters(dto);

      expect(result).toEqual(expectedResult);
      expect(mockCountersService.createCounters).toHaveBeenCalledWith(dto);
    });
  });

  describe('patchCounters', () => {
    it('should call service.updateCounters with id and dto', async () => {
      const id = 1;
      const dto = { value: 'updated', count: 1 };
      const expectedResult = { id, ...dto };
      (mockCountersService.updateCounters as jest.Mock).mockResolvedValue(
        expectedResult,
      );

      const result = await controller.patchCounters(id, dto);

      expect(result).toEqual(expectedResult);
      expect(mockCountersService.updateCounters).toHaveBeenCalledWith({
        id,
        ...dto,
      });
    });
  });
});
