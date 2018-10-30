import {flatten, unflatten} from 'flat';
import {FormValidationErrors} from './index';

const unflattenErrors = (formValidationErrors: FormValidationErrors) => {
  return unflatten(formValidationErrors);
};

const flattenErrors = (formValidationErrors: FormValidationErrors): {[key: string]: string[]} | null => {
  return formValidationErrors
    ? flatten(formValidationErrors, {
        safe: true,
      })
    : null;
};

export const utils = {
  flattenErrors,
  unflattenErrors,
};
