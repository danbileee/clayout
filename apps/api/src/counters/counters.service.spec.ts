import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CountersService } from './counters.service';
import { CounterEntity } from './entities/counter.entity';
import {
  createMockRepositoryProvider,
  createMockCounter,
  createMockCounters,
  faker,
} from '../test/test-utils';

describe('CountersService', () => {
  let service: CountersService;
  let mockRepository: ReturnType<
    typeof createMockRepositoryProvider
  >['useValue'];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CountersService, createMockRepositoryProvider(CounterEntity)],
    }).compile();

    service = module.get<CountersService>(CountersService);
    mockRepository = module.get(getRepositoryToken(CounterEntity));
  });

  it('should be defined', () => {
    // Arrange/Act/Assert
    expect(service).toBeDefined();
  });

  describe('getCounters', () => {
    it('should return all counters for valid param', async () => {
      // Arrange
      const mockCounters = createMockCounters(3);
      mockRepository.find.mockResolvedValue(mockCounters);
      const param = faker.word.words(1);
      // Act
      const result = await service.getCounters(param);
      // Assert
      expect(result).toContain(param);
      expect(result).toContain(JSON.stringify(mockCounters[0]));
      expect(mockRepository.find).toHaveBeenCalled();
    });

    it('should return string with empty array if no counters exist', async () => {
      // Arrange
      mockRepository.find.mockResolvedValue([]);
      const param = faker.word.words(1);
      // Act
      const result = await service.getCounters(param);
      // Assert
      expect(result).toContain(param);
      expect(result).toContain('[]');
    });
  });

  describe('createCounters', () => {
    it('should create a counter with valid input', async () => {
      // Arrange
      const dto = createMockCounter();
      const expectedResult = { ...dto };
      mockRepository.save.mockResolvedValue(expectedResult);
      // Act
      const result = await service.createCounters(dto as any);
      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockRepository.save).toHaveBeenCalledWith(dto);
    });

    it('should handle invalid input (null/undefined)', async () => {
      // Arrange
      mockRepository.save.mockResolvedValue(undefined);
      // Act/Assert
      await expect(
        service.createCounters(null as any),
      ).resolves.toBeUndefined();
      await expect(
        service.createCounters(undefined as any),
      ).resolves.toBeUndefined();
    });
  });

  describe('updateCounters', () => {
    it('should update a counter with valid dto', async () => {
      // Arrange
      const dto = createMockCounter({ value: 'updated', count: 1 });
      const existingCounter = createMockCounter({ id: dto.id, value: 'old' });
      const expectedResult = { ...dto };
      mockRepository.findOne.mockResolvedValue(existingCounter);
      mockRepository.save.mockResolvedValue(expectedResult);
      mockRepository.increment.mockResolvedValue({ affected: 1 } as any);
      // Act
      const result = await service.updateCounters(dto as any);
      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: dto.id },
      });
      expect(mockRepository.increment).toHaveBeenCalledWith(
        { id: dto.id },
        'count',
        1,
      );
      expect(mockRepository.save).toHaveBeenCalledWith(dto);
    });

    it('should throw if counter not found', async () => {
      // Arrange
      const dto = createMockCounter({ id: 999 });
      mockRepository.findOne.mockResolvedValue(null);
      // Act/Assert
      await expect(service.updateCounters(dto as any)).rejects.toThrow(
        'Counter not found',
      );
    });

    it('should handle undefined/null/empty dto', async () => {
      // Arrange
      mockRepository.findOne.mockResolvedValue(null);
      // Act/Assert
      await expect(service.updateCounters(undefined as any)).rejects.toThrow();
      await expect(service.updateCounters(null as any)).rejects.toThrow();
      await expect(service.updateCounters({} as any)).rejects.toThrow();
    });

    it('should increment a large count', async () => {
      // Arrange
      const dto = createMockCounter({ count: 1_000_000 });
      const existingCounter = createMockCounter({ id: dto.id, count: 999_999 });
      const expectedResult = { ...dto };
      mockRepository.findOne.mockResolvedValue(existingCounter);
      mockRepository.save.mockResolvedValue(expectedResult);
      mockRepository.increment.mockResolvedValue({ affected: 1 } as any);
      // Act
      const result = await service.updateCounters(dto as any);
      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockRepository.increment).toHaveBeenCalledWith(
        { id: dto.id },
        'count',
        1,
      );
    });
  });
});
