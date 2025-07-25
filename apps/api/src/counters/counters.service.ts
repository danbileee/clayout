import { BadRequestException, Injectable } from '@nestjs/common';
import { CounterEntity } from './entities/counter.entity';
import { Repository } from 'typeorm';
import type { DB } from '@clayout/interface';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CountersService {
  constructor(
    @InjectRepository(CounterEntity)
    private readonly countersRepository: Repository<CounterEntity>,
  ) {}

  async getCounters(
    ts: string,
  ): Promise<{ counters: CounterEntity[]; ts: string }> {
    const counters = await this.countersRepository.find();

    return { counters, ts };
  }

  async createCounters(dto: DB<'counters'>) {
    return this.countersRepository.save(dto);
  }

  async updateCounters(dto: DB<'counters'>) {
    const counter = await this.countersRepository.findOne({
      where: { id: dto.id },
    });

    if (!counter) {
      throw new BadRequestException('Counter not found');
    }

    if (dto.value) {
      counter.value = dto.value;
    }

    await this.countersRepository.increment({ id: dto.id }, 'count', 1);

    return this.countersRepository.save(dto);
  }
}
