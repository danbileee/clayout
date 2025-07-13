import { BadRequestException, Injectable } from '@nestjs/common';
import { CounterEntity } from './entities/counter.entity';
import { Repository } from 'typeorm';
import type { SupabaseTable } from '@clayout/interface';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CountersService {
  constructor(
    @InjectRepository(CounterEntity)
    private readonly countersRepository: Repository<CounterEntity>,
  ) {}

  async getCounters(param: string): Promise<string> {
    console.log({ param });
    const counters = await this.countersRepository.find();

    return `Hello World~~~~~~~!!!!! ${param}\n${counters.length ? counters.map((counter) => JSON.stringify(counter)).join(', ') : '[]'}`;
  }

  async createCounters(dto: SupabaseTable<'counters'>) {
    return this.countersRepository.save(dto);
  }

  async updateCounters(dto: SupabaseTable<'counters'>) {
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
