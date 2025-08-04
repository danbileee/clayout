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
  opened_at?: Date;

  @ManyToOne(() => EmailEntity, (email) => email.email_click_events)
  email: EmailEntity;
}
