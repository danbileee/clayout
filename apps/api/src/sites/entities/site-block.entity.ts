import { IsObject, IsOptional, IsString, Matches } from 'class-validator';
import { BaseEntity } from 'src/shared/entities/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import {
  KebabCase,
  SiteBlockTypes,
  SitePageCategories,
  SitePageCategory,
  StieBlockType,
} from '@clayout/interface';
import { SiteEntity } from './site.entity';
import { SitePageEntity } from './site-page.entity';

@Entity('site_blocks')
export class SiteBlockEntity extends BaseEntity {
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
    enum: Object.values(SiteBlockTypes),
    default: SiteBlockTypes.None,
  })
  type: StieBlockType;

  @Column({
    nullable: true,
    type: 'jsonb',
  })
  @IsOptional()
  @IsObject()
  data: Record<string, any>;

  @ManyToOne(() => SitePageEntity, (page) => page.blocks, {
    nullable: false,
  })
  page: SitePageEntity;
}
