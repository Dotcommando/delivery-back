import { ValidateIf, ValidationOptions } from 'class-validator';

export function ValidateIfNull(validationOptions?: ValidationOptions) {
  return ValidateIf((object, value) => value === null || value === '' || value === 'null' || value === 'undefined', validationOptions);
}
