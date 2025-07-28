import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { IsDate, IsEmail, IsJSON, IsOptional, IsString } from 'class-validator';
import { BaseEntity } from 'src/shared/entities/base.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { EmailClickEventEntity } from './email-click-event.entity';

@Entity('emails')
export class EmailEntity extends BaseEntity {
  @Column({
    nullable: false,
  })
  @IsEmail()
  to: string;

  @Column({
    nullable: false,
  })
  @IsString()
  subject: string;

  @Column({
    nullable: false,
  })
  @IsString()
  template: string;

  @Column({
    nullable: true,
    type: 'jsonb',
  })
  @IsOptional()
  @IsJSON()
  context: Record<string, any>;

  @Column({
    nullable: true,
    type: 'timestamptz',
  })
  @IsOptional()
  @IsDate()
  sent_at?: Date;

  @Column({
    nullable: true,
    type: 'timestamptz',
  })
  @IsOptional()
  @IsDate()
  opened_at?: Date;

  @Column({
    nullable: true,
    type: 'timestamptz',
  })
  @IsOptional()
  @IsDate()
  failed_at?: Date;

  @Column({
    nullable: true,
  })
  @IsOptional()
  @IsString()
  error_log?: string;

  @ManyToOne(() => UserEntity, (user) => user.email)
  user: UserEntity;

  @OneToMany(
    () => EmailClickEventEntity,
    (emailClickEvent) => emailClickEvent.email,
  )
  email_click_events: EmailClickEventEntity[];
}
