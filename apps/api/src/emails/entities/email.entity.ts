import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import {
  IsDate,
  IsEmail,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
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
  @IsObject()
  context: Record<string, string>;

  @Column({
    nullable: true,
    type: 'timestamptz',
    precision: 6,
  })
  @IsOptional()
  @IsDate()
  sentAt?: Date;

  @Column({
    nullable: true,
    type: 'timestamptz',
    precision: 6,
  })
  @IsOptional()
  @IsDate()
  failedAt?: Date;

  @Column({
    nullable: true,
  })
  @IsOptional()
  @IsString()
  errorLog?: string;

  @ManyToOne(() => UserEntity, (user) => user.email)
  user: UserEntity;

  @OneToMany(
    () => EmailClickEventEntity,
    (emailClickEvent) => emailClickEvent.email,
  )
  emailClickEvents: EmailClickEventEntity[];
}
