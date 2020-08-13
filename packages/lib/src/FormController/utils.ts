import {flatten, unflatten} from 'flat';
import set from 'lodash/set';
import get from 'lodash/get';
import unset from 'lodash/unset';
import type {FormValidationErrors} from './FormController.types';

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
  getValue: get,
  setValue: set,
  unsetValue: unset,
};
