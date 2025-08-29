import { IsBoolean, IsString } from 'class-validator';
import { BaseEntity } from 'src/shared/entities/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { SiteEntity } from './site.entity';

@Entity('site_domains')
export class SiteDomainEntity extends BaseEntity {
  @Column({ unique: true })
  @IsString()
  hostname: string;

  @Column({ type: 'boolean', default: false })
  @IsBoolean()
  isVerified: boolean;

  @ManyToOne(() => SiteEntity, (site) => site.domains, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  site: SiteEntity;
}
