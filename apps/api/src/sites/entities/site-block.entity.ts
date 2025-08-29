import { IsObject, IsOptional, IsString, Matches } from 'class-validator';
import { BaseEntity } from 'src/shared/entities/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { KebabCase, SiteBlockTypes, StieBlockType } from '@clayout/interface';
import { SitePageEntity } from './site-page.entity';
import { SiteEntity } from './site.entity';

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

  @Column({
    nullable: true,
    type: 'jsonb',
  })
  @IsOptional()
  @IsObject()
  style: Record<string, any>;

  @Column({
    nullable: true,
    type: 'jsonb',
  })
  @IsOptional()
  @IsObject()
  containerStyle: Record<string, any>;

  @ManyToOne(() => SitePageEntity, (page) => page.blocks, {
    nullable: false,
  })
  page: SitePageEntity;

  @ManyToOne(() => SiteEntity, (site) => site.blocks, {
    nullable: false,
  })
  site: SiteEntity;
}
