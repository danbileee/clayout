import { Column, Entity, ManyToOne } from 'typeorm';
import { IsDate, IsOptional, IsString } from 'class-validator';
import { BaseEntity } from 'src/shared/entities/base.entity';
import { EmailEntity } from './email.entity';

@Entity('email_click_events')
export class EmailClickEventEntity extends BaseEntity {
  @Column({
    type: 'timestamptz',
    precision: 6,
  })
  @IsOptional()
  @IsDate()
  clickedAt?: Date;

  @Column()
  @IsString()
  link: string;

  @Column()
  @IsString()
  buttonText: string;

  @ManyToOne(() => EmailEntity, (email) => email.emailClickEvents)
  email: EmailEntity;
}
