import { IsBoolean, IsString } from 'class-validator';
import { BaseEntity } from 'src/shared/entities/base.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { SiteEntity } from './site.entity';
import { SitedomainStatus, SiteDomainStatuses } from '@clayout/interface';

@Index('UQ_site_domains_one_primary_per_site', ['site'], {
  unique: true,
  where: '"isPrimary" = true',
})
@Index('IDX_site_domains_siteId', ['site'])
@Entity('site_domains')
export class SiteDomainEntity extends BaseEntity {
  @Column({ unique: true })
  @IsString()
  hostname: string;

  @Column({
    type: 'enum',
    enum: Object.values(SiteDomainStatuses),
    default: SiteDomainStatuses.Pending,
  })
  status: SitedomainStatus;

  @Column({
    nullable: false,
    default: false,
  })
  @IsBoolean()
  isPrimary: boolean;

  @ManyToOne(() => SiteEntity, (site) => site.domains, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  site: SiteEntity;

  @ManyToOne(() => SiteDomainEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'redirectToDomainId' })
  redirectTo?: SiteDomainEntity;
}
