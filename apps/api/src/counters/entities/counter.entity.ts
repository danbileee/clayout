import { IsInt, IsString } from 'class-validator';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../shared/entities/base.entity';

@Entity('counters')
export class CounterEntity extends BaseEntity {
  @Column({ nullable: true })
  @IsString({
    message: 'value must be a string.',
  })
  value: string;

  @Column({ default: 0 })
  @IsInt({
    message: 'count must be an integer.',
  })
  count: number;
}
