import {flatten} from 'flat';
import type {FormValidationErrors} from '../FormController';

export const flattenValues = (
  formValidationErrors: FormValidationErrors,
  safe = true,
): Record<string, string[]> | null => {
  return formValidationErrors
    ? flatten(formValidationErrors, {
        safe,
      })
    : null;
};
