import { IsBoolean, IsInt, IsObject, IsString, Matches } from 'class-validator';
import { BaseEntity } from 'src/shared/entities/base.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import {
  KebabCase,
  SitePageCategories,
  SitePageCategory,
  SitePageMeta,
} from '@clayout/interface';
import { SiteEntity } from './site.entity';
import { SiteBlockEntity } from './site-block.entity';

@Entity('site_pages')
export class SitePageEntity extends BaseEntity {
  @Column({
    nullable: false,
    unique: true,
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
