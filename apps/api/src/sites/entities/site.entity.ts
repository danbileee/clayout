import {
  IsDate,
  IsObject,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { BaseEntity } from 'src/shared/entities/base.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import {
  KebabCase,
  SiteCategories,
  SiteCategory,
  SiteStatus,
  SiteStatuses,
} from '@clayout/interface';
import { SitePageEntity } from './site-page.entity';
import { SiteBlockEntity } from './site-block.entity';

@Entity('sites')
export class SiteEntity extends BaseEntity {
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
    enum: Object.values(SiteStatuses),
    default: SiteStatuses.Draft,
  })
  status: SiteStatus;

  @Column({
    type: 'enum',
    enum: Object.values(SiteCategories),
    default: SiteCategories.None,
  })
  category: SiteCategory;

  @Column({
    nullable: true,
    type: 'jsonb',
  })
  @IsObject()
  meta: Record<string, any>;

  @Column({
    nullable: true,
    type: 'timestamptz',
    precision: 6,
  })
  @IsOptional()
  @IsDate()
  last_published_at?: Date;

  @ManyToOne(() => UserEntity, (user) => user.sites, {
    nullable: false,
  })
  author: UserEntity;

  @OneToMany(() => SitePageEntity, (page) => page.site)
  pages: SitePageEntity[];

  @OneToMany(() => SiteBlockEntity, (block) => block.site)
  blocks: SiteBlockEntity[];
}
