import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

const ALLOWED_PROPERTIES = ['name', 'password'];

@ValidatorConstraint({ name: 'isOnlyAllowedProperties', async: false })
export class ConstraintUserValidator implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const objectProperties = Object.keys(value);
    const invalidProperties = objectProperties.filter(property => !ALLOWED_PROPERTIES.includes(property));

    if (invalidProperties.length > 0) {
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `Object contains properties that are not allowed. For user allowed only: ${ALLOWED_PROPERTIES.join(', ')}`;
  }
}
