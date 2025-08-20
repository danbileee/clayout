import { IsNumber, IsOptional, IsString, Matches } from 'class-validator';
import { PickType } from '@nestjs/mapped-types';
import { BaseEntity } from '../entities/base.entity';

export interface PaginationConfig<T extends BaseEntity> {
  allowedSortFields: (keyof T)[];
  allowedFilterFields: (keyof T)[];
}

export class PaginationDto {
  @IsNumber()
  @IsOptional()
  from: number = 0;

  @IsNumber()
  @IsOptional()
  to?: number;

  @IsNumber()
  @IsOptional()
  page?: number;

  @IsNumber()
  @IsOptional()
  take: number = 20;

  @IsOptional()
  @IsString()
  sort?: string;

  @IsOptional()
  @IsString()
  filter?: string;

  static createWithConfig<T extends BaseEntity>(config: PaginationConfig<T>) {
    const { allowedSortFields, allowedFilterFields } = config;

    class ConfiguredPaginationDto extends PaginationDto {
      @IsOptional()
      @Matches(
        new RegExp(
          `^(${allowedSortFields.join('|')}):(asc|desc)(&(${allowedSortFields.join(
            '|',
          )}):(asc|desc))*$`,
        ),
        {
          message: `Sort must be in format "field:direction" where field is one of: ${allowedSortFields.join(
            ', ',
          )} and direction is either "asc" or "desc". Multiple sorts can be combined with "&".`,
        },
      )
      sort?: string;

      @IsOptional()
      @Matches(
        new RegExp(
          `^(${allowedFilterFields.join('|')}):((\\d+(-\\d+)?|[^&:,]+(,[^&:,]+)*))(&(${allowedFilterFields.join('|')}):((\\d+(-\\d+)?|[^&:,]+(,[^&:,]+)*)))*$`,
        ),
        {
          message: `Filter must be in format "field:value", "field:from-to", or "field:value1,value2,value3" where field is one of: ${allowedFilterFields.join(', ')}. Multiple filters can be combined with "&".`,
        },
      )
      filter?: string;
    }

    return ConfiguredPaginationDto;
  }
}

export interface SortOption {
  property: string;
  direction: 'asc' | 'desc';
}

export interface FilterOption {
  property: string;
  from?: number;
  to?: number;
  contains?: string[];
}

export class PaginationOptions extends PickType(PaginationDto, [
  'from',
  'to',
  'page',
  'take',
]) {
  sort?: SortOption[];
  filter?: FilterOption[];

  static fromDto(dto: PaginationDto): PaginationOptions {
    const options = new PaginationOptions();
    options.from = dto.from;
    options.to = dto.to;
    options.page = dto.page;
    options.take = dto.take;

    if (dto.sort) {
      options.sort = dto.sort.split('&').map((item) => {
        const [property, direction] = item.split(':');
        return {
          property,
          direction: direction.toLowerCase() as 'asc' | 'desc',
        };
      });
    }

    if (dto.filter) {
      options.filter = dto.filter.split('&').map((item) => {
        const [property, value] = item.split(':');
        const [from, to] = value.split('-').map(Number);

        if (from && to) {
          return { property, from, to };
        }

        const contains = value.split(',');

        return { property, contains };
      });
    }

    return options;
  }
}
