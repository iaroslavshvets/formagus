import {flatten, unflatten} from 'flat';
import {FormValidationErrors} from './index';

const unflattenValues = (formValidationErrors: FormValidationErrors) => {
  return unflatten(formValidationErrors);
};

const flattenValues = (formValidationErrors: FormValidationErrors, safe = true): {[key: string]: string[]} | null => {
  return formValidationErrors
    ? flatten(formValidationErrors, {
        safe,
      })
    : null;
};

export const utils = {
  flattenValues,
  unflattenValues,
};
