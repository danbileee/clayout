import { IsDate, IsOptional, IsString } from 'class-validator';
import { BaseEntity } from 'src/shared/entities/base.entity';
import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { SiteEntity } from './site.entity';

@Entity('site_releases')
@Index(['site', 'version'], { unique: true })
export class SiteReleaseEntity extends BaseEntity {
  @Column({ type: 'text' })
  @IsString()
  htmlSnapshot: string;

  @Column({
    nullable: true,
    type: 'timestamptz',
    precision: 6,
  })
  @IsOptional()
  @IsDate()
  publishedAt?: Date;

  @Column()
  @IsString()
  version: string;

  @ManyToOne(() => SiteEntity, (site) => site.releases, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  site: SiteEntity;
}
