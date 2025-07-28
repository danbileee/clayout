import { Column, Entity, ManyToOne } from 'typeorm';
import { IsDate, IsOptional, IsString } from 'class-validator';
import { BaseEntity } from 'src/shared/entities/base.entity';
import { EmailEntity } from './email.entity';

@Entity('email_click_events')
export class EmailClickEventEntity extends BaseEntity {
  @Column({
    type: 'timestamptz',
  })
  @IsOptional()
  @IsDate()
  clicked_at?: Date;

  @Column()
  @IsString()
  link: string;

  @Column()
  @IsString()
  button_text: string;

  @ManyToOne(() => EmailEntity, (email) => email.email_click_events)
  email: EmailEntity;
}
