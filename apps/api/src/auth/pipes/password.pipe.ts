import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class PasswordPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value !== 'string') {
      throw new BadRequestException('Invalid parameter');
    }

    if (value.length > 8) {
      throw new BadRequestException(
        'Passwords should be lesser than 8 characters.',
      );
    }

    return value;
  }
}

@Injectable()
export class MaxLengthPipe implements PipeTransform {
  constructor(
    private readonly length: number,
    private readonly title: string,
  ) {}

  transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value !== 'string') {
      throw new BadRequestException('Invalid parameter');
    }

    if (value.length > this.length) {
      throw new BadRequestException(
        `${this.title} should be lesser than ${this.length} characters.`,
      );
    }

    return value;
  }
}

@Injectable()
export class MinLengthPipe implements PipeTransform {
  constructor(
    private readonly length: number,
    private readonly title: string,
  ) {}

  transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value !== 'string') {
      throw new BadRequestException('Invalid parameter');
    }

    if (value.length < this.length) {
      throw new BadRequestException(
        `${this.title} should be more than ${this.length} characters.`,
      );
    }

    return value;
  }
}
