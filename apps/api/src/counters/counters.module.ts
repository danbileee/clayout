import { Module } from '@nestjs/common';
import { CountersService } from './counters.service';
import { CountersController } from './counters.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CounterEntity } from 'src/counters/entities/counter.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CounterEntity])],
  controllers: [CountersController],
  providers: [CountersService],
})
export class CountersModule {}
