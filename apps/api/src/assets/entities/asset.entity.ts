import { AssetType, AssetTypes } from '@clayout/interface';
import { IsEnum, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from 'src/shared/entities/base.entity';

@Entity('assets')
export class AssetEntity extends BaseEntity {
  @Column({
    default: 0,
  })
  @IsInt()
  @IsOptional()
  order: number;

  @Column({
    type: 'enum',
    enum: Object.values(AssetTypes),
    default: AssetTypes.None,
  })
  @IsEnum(AssetTypes)
  targetType: AssetType;

  @Column()
  @IsNumber()
  targetId: number;

  @Column()
  @IsString()
  path: string;
}
