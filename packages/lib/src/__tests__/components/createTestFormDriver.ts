import {fireEvent} from '@testing-library/react';

export const createTestFormDriver = (options: {wrapper: Element}) => {
  const {wrapper} = options;

  const API = {
    get: {
      values: () => {
        return JSON.parse(wrapper.querySelector('[data-hook="form-values"]')?.textContent ?? '');
      },
      serialized: () => {
        return wrapper;
      },
    },

    when: {
      submit: async () => {
        return fireEvent.submit(wrapper.querySelector(`[data-hook="test-form"]`)!, {target: {}});
      },
    },
  };

  return {
    get: {
      values: API.get.values,
      serialized: API.get.serialized,
    },
    when: {
      submit: API.when.submit,
    },
  };
};
