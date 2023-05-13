import _isEmpty from 'lodash/isEmpty';

export const isEmpty = (value: unknown) => {
  // short-circuit for performance
  if (value === undefined || value === null) {
    return true;
  }
  return _isEmpty(value) as boolean;
};
