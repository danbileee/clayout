import { Column, Entity, ManyToOne } from 'typeorm';
import { IsDate, IsOptional } from 'class-validator';
import { BaseEntity } from 'src/shared/entities/base.entity';
import { EmailEntity } from './email.entity';

@Entity('email_open_events')
export class EmailOpenEventEntity extends BaseEntity {
  @Column({
    type: 'timestamptz',
    precision: 6,
  })
  @IsOptional()
  @IsDate()
  openedAt?: Date;

  @ManyToOne(() => EmailEntity, (email) => email.emailClickEvents)
  email: EmailEntity;
}
