import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

const ALLOWED_PROPERTIES = ['type', 'value'];

@ValidatorConstraint({ name: 'isOnlyAllowedProperties', async: false })
export class ConstraintUserContactValidator implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    if (value.contacts && Array.isArray(value.contacts)) {
      for (const contact of value.contacts) {
        const contactProperties = Object.keys(contact);
        const invalidContactProperties = contactProperties.filter(
          property => !ALLOWED_PROPERTIES.includes(property)
        );

        if (invalidContactProperties.length > 0) {
          return false;
        }
      }
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `Object contains properties that are not allowed. For objects in contacts allowed only: ${ALLOWED_PROPERTIES.join(', ')}`;
  }
}
