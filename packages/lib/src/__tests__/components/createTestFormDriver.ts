import {fireEvent} from '@testing-library/react';

export const createTestFormDriver = (options: {wrapper: Element}) => {
  const {wrapper} = options;

  const getValues = () => {
    return JSON.parse(wrapper.querySelector('[data-hook="form-values"]')?.textContent ?? '');
  };
  const getSerialized = () => {
    return wrapper;
  };
  const whenSubmit = async () => {
    return fireEvent.submit(wrapper.querySelector(`[data-hook="test-form"]`)!, {target: {}});
  };

  return {
    getValues,
    getSerialized,
    whenSubmit,
  };
};
