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
  SiteMeta,
  SiteStatus,
  SiteStatuses,
} from '@clayout/interface';
import { SitePageEntity } from './site-page.entity';
import { SiteBlockEntity } from './site-block.entity';
import { SiteReleaseEntity } from './site-release.entity';
import { SiteDomainEntity } from './site-domain.entity';

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
  meta: SiteMeta;

  @Column({
    nullable: true,
    type: 'timestamptz',
    precision: 6,
  })
  @IsOptional()
  @IsDate()
  lastPublishedAt?: Date;

  @Column({
    nullable: true,
  })
  @IsOptional()
  @IsString()
  lastPublishedVersion?: string;

  @ManyToOne(() => UserEntity, (user) => user.sites, {
    nullable: false,
  })
  author: UserEntity;

  @OneToMany(() => SitePageEntity, (page) => page.site)
  pages: SitePageEntity[];

  @OneToMany(() => SiteBlockEntity, (block) => block.site)
  blocks: SiteBlockEntity[];

  @OneToMany(() => SiteReleaseEntity, (release) => release.site)
  releases: SiteReleaseEntity[];

  @OneToMany(() => SiteDomainEntity, (domain) => domain.site)
  domains: SiteDomainEntity[];
}
