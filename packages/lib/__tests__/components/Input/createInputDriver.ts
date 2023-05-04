import {fireEvent} from '@testing-library/react';

export const createInputDriver = (options: {wrapper: Element; dataHook: string}) => {
  const {wrapper, dataHook} = options;

  const API = {
    get: {
      root: () => {
        return wrapper.querySelector(`[data-hook="${dataHook}"]`);
      },
      input: () => {
        return API.get.root()?.querySelector<HTMLInputElement>(`[data-hook="input-${dataHook}"]`)!;
      },
      inputNode: () => {
        return API.get.input();
      },
      value: () => {
        return API.get.inputNode().value;
      },
      meta: (key: string) => {
        return API.get.root()?.querySelector(`[data-hook="meta_${key}"]`)!.textContent;
      },
      errors: (key?: string) => {
        if (key) {
          const error = API.get.root()?.querySelector(`[data-hook="error:${key}"]`);

          return error ? error.textContent : null;
        }
        const errors = Array.from(API.get.root()?.querySelectorAll(`[data-hook^="error:"]`)!);

        return errors.length
          ? errors.map((error) => {
              return error.textContent;
            })
          : null;
      },
    },

    when: {
      setCustomState: () => {
        return fireEvent.click(API.get.root()?.querySelector(`[data-hook="set-custom-state"]`)!);
      },
      clickOnCallback: () => {
        return fireEvent.click(API.get.root()?.querySelector(`[data-hook="callback"]`)!);
      },
      focus: () => {
        return fireEvent.focus(API.get.input());
      },
      blur: () => {
        return fireEvent.blur(API.get.input());
      },
      validate: () => {
        return fireEvent.click(API.get.root()?.querySelector(`[data-hook="validate"]`)!);
      },
      validateField: () => {
        return fireEvent.click(API.get.root()?.querySelector(`[data-hook="validate-field"]`)!);
      },
      change: (value: string) => {
        API.when.focus();
        return fireEvent.change(API.get.input(), {target: {value}});
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
      clickOnCallback: API.when.clickOnCallback,
      setCustomState: API.when.setCustomState,
      focus: API.when.focus,
      blur: API.when.blur,
      validate: API.when.validate,
      change: API.when.change,
      validateField: API.when.validateField,
    },
  };
};
