import _isEmpty from 'lodash/isEmpty';

export const isEmpty = (value: unknown) => {
  if (value === undefined) {
    // short-circuit for performance
    return true;
  }
  return _isEmpty(value) as boolean;
};
