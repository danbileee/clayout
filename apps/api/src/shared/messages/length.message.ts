import { ValidationArguments } from 'class-validator/types/validation/ValidationArguments';

export function lengthMessage(args: ValidationArguments) {
  if (args.constraints.length === 2) {
    return `${args.property} length must be between ${args.constraints[0]}~${args.constraints[1]}.`;
  }

  return `${args.property} length must be more than ${args.constraints[0]}.`;
}
