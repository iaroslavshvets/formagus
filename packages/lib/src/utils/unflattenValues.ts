import {unflatten} from 'flat';
import type {FormValidationErrors} from '../FormController';

export const unflattenValues = (formValidationErrors: FormValidationErrors) => {
  return unflatten(formValidationErrors);
};
