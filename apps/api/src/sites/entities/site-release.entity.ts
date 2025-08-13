import { IsDate, IsInt, IsOptional, IsString } from 'class-validator';
import { BaseEntity } from 'src/shared/entities/base.entity';
import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { SiteEntity } from './site.entity';

@Entity('site_releases')
@Index(['site', 'version'], { unique: true })
export class SiteReleaseEntity extends BaseEntity {
  @ManyToOne(() => SiteEntity, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  site: SiteEntity;

  @Column({ type: 'text' })
  @IsString()
  html_snapshot: string;

  @Column({
    nullable: true,
    type: 'timestamptz',
    precision: 6,
  })
  @IsOptional()
  @IsDate()
  published_at?: Date;

  @Column()
  @IsInt()
  version: number;
}
