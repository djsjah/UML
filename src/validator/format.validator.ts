interface ValidationError {
  field: string;
  message: string;
  children?: ValidationError[];
}

export function formatValidationErrors(errors: any[]): ValidationError[] {
  const formattedErrors: ValidationError[] = [];

  for (const error of errors) {
    if (error.constraints) {
      const formattedError: ValidationError = {
        field: error.property,
        message: Object.values(error.constraints).join(', '),
      };
      formattedErrors.push(formattedError);
    } else if (error.property === 'contacts') {
      for (let i = 0; i < error.children.length; i++) {
        const contactErrors = formatContactErrors(error.children[i], i);
        formattedErrors.push(...contactErrors);
      }
    }

    if (error.children && error.children.length > 0) {
      const childErrors = formatValidationErrors(error.children);
      formattedErrors.push(...childErrors);
    }
  }

  return formattedErrors;
}

function formatContactErrors(contactErrors: any[], contactIndex: number): ValidationError[] {
  const formattedContactErrors: ValidationError[] = [];

  for (let i = 0; i < contactErrors.length; i++) {
    const error = contactErrors[i];
    if (error && error.constraints) {
      const formattedError: ValidationError = {
        field: `contacts[${contactIndex}] - ${error.property}`,
        message: Object.values(error.constraints).join(', '),
      };
      formattedContactErrors.push(formattedError);
    }
  }

  return formattedContactErrors;
}
