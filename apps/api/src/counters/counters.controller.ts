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
import { Roles } from 'src/users/decorators/role.decorator';
import { UserRoleWeights } from 'src/users/constants/role.const';

@Roles({ minWeight: UserRoleWeights.User })
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
  async postCounters(
    @Body()
    dto: Pick<DB<'counters'>, 'value'>,
  ): Promise<{ counter: CounterEntity }> {
    const counter = await this.countersService.createCounters(dto);

    return { counter };
  }

  @Patch(':id')
  async patchCounters(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    dto: Pick<DB<'counters'>, 'id' | 'value'>,
  ): Promise<{ counter: CounterEntity }> {
    const counter = await this.countersService.updateCounters({ id, ...dto });

    return { counter };
  }
}
