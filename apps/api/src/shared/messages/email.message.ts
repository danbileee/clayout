import { ValidationArguments } from 'class-validator';

export function emailMessage(args: ValidationArguments) {
  return `Invalid ${args.property}. Email must include "@" and a domain name (e.g., example@site.com).`;
}
