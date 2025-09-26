import { Injectable } from '@nestjs/common';
import {
  EntityTarget,
  FindOptionsWhere,
  ObjectLiteral,
  QueryRunner,
  Repository,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class ReorderService {
  async reorderWithinScope<
    T extends { id: number; order: number } & ObjectLiteral,
  >(
    repository: Repository<T>,
    entity: EntityTarget<T>,
    scopeWhere: FindOptionsWhere<T>,
    sourceId: number,
    targetId: number,
    options?: { queryRunner?: QueryRunner },
  ): Promise<void> {
    if (sourceId === targetId) return;

    const manager = options?.queryRunner?.manager ?? repository.manager;

    const sourceWhere = {
      ...scopeWhere,
      id: sourceId,
    } satisfies FindOptionsWhere<T>;
    const targetWhere = {
      ...scopeWhere,
      id: targetId,
    } satisfies FindOptionsWhere<T>;

    const source = await repository.findOne({ where: sourceWhere });
    const target = await repository.findOne({ where: targetWhere });

    if (!source || !target) {
      throw new Error('Source or target not found in scope');
    }

    const sourceOrder = source.order ?? 0;
    const targetOrder = target.order ?? 0;

    if (sourceOrder === targetOrder) return;

    await manager.transaction(async (tx) => {
      if (sourceOrder < targetOrder) {
        const decrement = {
          order: () => '"order" - 1',
        } as QueryDeepPartialEntity<T>;
        await tx
          .createQueryBuilder()
          .update(entity)
          .set(decrement)
          .where(scopeWhere)
          .andWhere('"order" > :sourceOrder AND "order" <= :targetOrder', {
            sourceOrder,
            targetOrder,
          })
          .execute();

        await tx.update(
          entity,
          { id: sourceId } as FindOptionsWhere<T>,
          { order: targetOrder } as unknown as QueryDeepPartialEntity<T>,
        );
      } else {
        const increment = {
          order: () => '"order" + 1',
        } as QueryDeepPartialEntity<T>;
        await tx
          .createQueryBuilder()
          .update(entity)
          .set(increment)
          .where(scopeWhere)
          .andWhere('"order" >= :targetOrder AND "order" < :sourceOrder', {
            sourceOrder,
            targetOrder,
          })
          .execute();

        await tx.update(
          entity,
          { id: sourceId } as FindOptionsWhere<T>,
          { order: targetOrder } as unknown as QueryDeepPartialEntity<T>,
        );
      }
    });
  }
}
