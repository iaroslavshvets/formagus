import {ReactWrapper} from 'enzyme';

export const createInputAdapterDriver = (options: {wrapper: ReactWrapper; dataHook: string}) => {
  const {wrapper, dataHook} = options;

  const API = {
    get: {
      root: () => {
        return wrapper.find(`[data-hook="${dataHook}"]`) as ReactWrapper;
      },
      input: () => {
        return API.get.root().find(`[data-hook="input-${dataHook}"]`) as ReactWrapper;
      },
      inputNode: () => {
        return API.get.input().getDOMNode() as HTMLInputElement;
      },
      value: () => {
        return API.get.inputNode().value;
      },
      meta: (key: string) => {
        return API.get
          .root()
          .find(`[data-hook="meta_${key}"]`)
          .at(0)
          .text();
      },
      errors: (key: string) => {
        const error = API.get.root().find(`[data-hook="error:${key}"]`);

        return error.length ? error.at(0).text() : null;
      },
    },

    when: {
      setCustomState: () => {
        API.get
          .root()
          .find(`[data-hook="set-custom-state"]`)
          .simulate('click');
      },
      focus: () => {
        API.get.input().simulate('focus');
      },
      blur: () => {
        API.get.input().simulate('blur');
      },
      validate: () => {
        API.get
          .root()
          .find(`[data-hook="validate"]`)
          .simulate('click');
      },
      change: (value: string) => {
        API.when.focus();
        API.get.input().simulate('change', {target: {value}});
      },
    },
  };

  return {
    get: {
      value: API.get.value,
      meta: API.get.meta,
      errors: API.get.errors,
    },
    when: {
      setCustomState: API.when.setCustomState,
      focus: API.when.focus,
      blur: API.when.blur,
      validate: API.when.validate,
      change: API.when.change,
    },
  };
};
