import { IsBoolean, IsInt, IsObject, IsString, Matches } from 'class-validator';
import { BaseEntity } from 'src/shared/entities/base.entity';
import { Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm';
import {
  KebabCase,
  SitePageCategories,
  SitePageCategory,
  SitePageContainerStyle,
  SitePageMeta,
} from '@clayout/interface';
import { SiteEntity } from './site.entity';
import { SiteBlockEntity } from './site-block.entity';

@Entity('site_pages')
@Index('UQ_site_pages_slug_per_site', ['site', 'slug'], { unique: true })
export class SitePageEntity extends BaseEntity {
  @Column({
    nullable: false,
  })
  @IsString()
  @Matches(KebabCase)
  slug: string;

  @Column({
    nullable: false,
  })
  @IsString()
  name: string;

  @Column({
    type: 'enum',
    enum: Object.values(SitePageCategories),
    default: SitePageCategories.Static,
  })
  category: SitePageCategory;

  @Column({
    nullable: true,
    type: 'jsonb',
  })
  @IsObject()
  meta: SitePageMeta;

  @Column({
    nullable: true,
    type: 'jsonb',
  })
  @IsObject()
  containerStyle: SitePageContainerStyle;

  @Column({
    nullable: false,
    default: 0,
  })
  @IsInt()
  order: number;

  @Column({
    nullable: false,
    default: false,
  })
  @IsBoolean()
  isHome: boolean;

  @Column({
    nullable: false,
    default: true,
  })
  @IsBoolean()
  isVisible: boolean;

  @ManyToOne(() => SiteEntity, (site) => site.pages, {
    nullable: false,
  })
  site: SiteEntity;

  @OneToMany(() => SiteBlockEntity, (block) => block.page)
  blocks: SiteBlockEntity[];
}
