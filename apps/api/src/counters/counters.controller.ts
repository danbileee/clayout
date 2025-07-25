import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CountersService } from './counters.service';
import { CounterEntity } from 'src/counters/entities/counter.entity';
import type { DB } from '@clayout/interface';

@Controller('counters')
export class CountersController {
  constructor(private readonly countersService: CountersService) {}

  @Get(':param')
  getCounters(
    @Param('param') param: string,
  ): Promise<{ counters: CounterEntity[]; ts: string }> {
    return this.countersService.getCounters(param);
  }

  @Post()
  postCounters(
    @Body()
    dto: DB<'counters'>,
  ): Promise<CounterEntity> {
    return this.countersService.createCounters(dto);
  }

  @Patch(':id')
  patchCounters(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    dto: DB<'counters'>,
  ): Promise<CounterEntity> {
    return this.countersService.updateCounters({ id, ...dto });
  }
}
