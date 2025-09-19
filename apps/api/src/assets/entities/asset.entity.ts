import { AssetTargetType, AssetTargetTypes } from '@clayout/interface';
import { IsEnum, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/shared/entities/base.entity';
import { UserEntity } from 'src/users/entities/user.entity';

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
    enum: Object.values(AssetTargetTypes),
    default: AssetTargetTypes.None,
  })
  @IsEnum(AssetTargetTypes)
  targetType: AssetTargetType;

  @Column()
  @IsNumber()
  targetId: number;

  @Column()
  @IsString()
  path: string;

  @ManyToOne(() => UserEntity, (user) => user.assets, {
    nullable: false,
  })
  author: UserEntity;
}
