import { IsInt, IsString } from 'class-validator';
import { Column, Entity } from 'typeorm';
import { BaseModel } from './base.entity';

@Entity()
export class CounterModel extends BaseModel {
  @Column()
  @IsString({
    message: 'value must be a string.',
  })
  value: string;

  @Column()
  @IsInt({
    message: 'count must be an integer.',
  })
  count: number;
}
