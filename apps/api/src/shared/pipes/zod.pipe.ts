import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ZodSchema } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema<any>) {}
  transform(value: any) {
    const isProduction = process.env.NODE_ENV === 'production';
    const result = this.schema.safeParse(value);
    if (!result.success)
      throw new BadRequestException(
        isProduction ? result.error.flatten() : result.error.errors,
      );
    return result.data;
  }
}
