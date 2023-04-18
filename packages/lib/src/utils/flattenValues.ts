import * as flat from 'flat';
import type {FormValidationErrors} from '../FormController';

export const flattenValues = (
  formValidationErrors: FormValidationErrors,
  safe = true,
): Record<string, string[]> | null => {
  return formValidationErrors
    ? flat.flatten(formValidationErrors, {
        safe,
      })
    : null;
};
