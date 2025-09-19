import {
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { BaseEntity } from 'src/shared/entities/base.entity';
import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { KebabCase, SiteBlockTypes, SiteBlockType } from '@clayout/interface';
import { SitePageEntity } from './site-page.entity';
import { SiteEntity } from './site.entity';

@Entity('site_blocks')
@Index('UQ_site_blocks_slug_per_page', ['page', 'slug'], { unique: true })
export class SiteBlockEntity extends BaseEntity {
  @Column({
    unique: true,
  })
  @IsString()
  @Matches(KebabCase)
  slug: string;

  @Column()
  @IsString()
  @IsOptional()
  name: string;

  @Column({
    type: 'enum',
    enum: Object.values(SiteBlockTypes),
    default: SiteBlockTypes.None,
  })
  type: SiteBlockType;

  @Column({
    nullable: false,
    default: 0,
  })
  @IsInt()
  order: number;

  @Column({
    nullable: true,
    type: 'jsonb',
  })
  @IsObject()
  data: Record<string, string>;

  @Column({
    nullable: true,
    type: 'jsonb',
  })
  @IsObject()
  style: Record<string, string>;

  @Column({
    nullable: true,
    type: 'jsonb',
  })
  @IsObject()
  containerStyle: Record<string, string>;

  @ManyToOne(() => SitePageEntity, (page) => page.blocks, {
    nullable: false,
  })
  page: SitePageEntity;

  @ManyToOne(() => SiteEntity, (site) => site.blocks, {
    nullable: false,
  })
  site: SiteEntity;
}
