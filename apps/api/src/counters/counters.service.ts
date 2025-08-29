import { Injectable, NotFoundException } from '@nestjs/common';
import { CounterEntity } from './entities/counter.entity';
import { Repository } from 'typeorm';
import type { Tables } from '@clayout/interface';
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

  async createCounters(dto: Pick<Tables<'counters'>, 'value'>) {
    const createdCounter = this.countersRepository.create(dto);
    const savedCounter = await this.countersRepository.save(createdCounter);

    return savedCounter;
  }

  async updateCounters(dto: Pick<Tables<'counters'>, 'id' | 'value'>) {
    const counter = await this.countersRepository.findOne({
      where: { id: dto.id },
    });

    if (!counter) {
      throw new NotFoundException('Counter not found');
    }

    if (dto.value) {
      counter.value = dto.value;
    }

    await this.countersRepository.increment({ id: dto.id }, 'count', 1);
    const updatedCounter = await this.countersRepository.save(counter);

    return updatedCounter;
  }
}
