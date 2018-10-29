import {ReactWrapper} from 'enzyme';
import toJson from 'enzyme-to-json';
import {Json} from 'enzyme-to-json';

export const createTestFormDriver = (options: {wrapper: ReactWrapper}) => {
  const {wrapper} = options;

  const API = {
    get: {
      values: () => {
        return JSON.parse(wrapper.find('[data-hook="form-values"]').getDOMNode().textContent || '');
      },
      serialized: () => {
        return toJson(wrapper, {noKey: true, mode: 'deep'}) as Json;
      },
    },

    when: {
      submit: () => {
        wrapper.find(`[data-hook="test-form"]`).simulate('submit', {target: {}});
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
