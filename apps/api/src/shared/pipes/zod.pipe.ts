import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ZodIssue, ZodIssueCode, ZodSchema } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema<any>) {}
  transform(value: any) {
    const isProduction = process.env.NODE_ENV === 'production';
    const result = this.schema.safeParse(value);
    if (!result.success)
      throw new BadRequestException(
        isProduction
          ? result.error.flatten()
          : getZodValidationError(result.error.errors),
      );
    return result.data;
  }
}

const getZodValidationError = (errors: ZodIssue[]): (string | ZodIssue)[] => {
  return errors.map((error) => {
    if (error.code === ZodIssueCode.invalid_type) {
      return `Invalid type for the property "${error.path.join('.')}". Expected ${error.expected} type but received ${error.received}`;
    }

    return error;
  });
};
