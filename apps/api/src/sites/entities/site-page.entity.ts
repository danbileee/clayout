import { IsObject, IsString, Matches } from 'class-validator';
import { BaseEntity } from 'src/shared/entities/base.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import {
  KebabCase,
  SitePageCategories,
  SitePageCategory,
} from '@clayout/interface';
import { SiteEntity } from './site.entity';
import { SiteBlockEntity } from './site-block.entity';

@Entity('site_pages')
export class SitePageEntity extends BaseEntity {
  @Column({
    unique: true,
  })
  @IsString()
  @Matches(KebabCase)
  slug: string;

  @Column()
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
  meta: Record<string, any>;

  @ManyToOne(() => SiteEntity, (site) => site.pages, {
    nullable: false,
  })
  site: SiteEntity;

  @OneToMany(() => SiteBlockEntity, (block) => block.page)
  blocks: SiteBlockEntity[];
}
