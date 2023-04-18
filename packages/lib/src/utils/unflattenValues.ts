import * as flat from 'flat';
import type {FormValidationErrors} from '../FormController';

export const unflattenValues = (formValidationErrors: FormValidationErrors) => {
  return flat.unflatten(formValidationErrors);
};
