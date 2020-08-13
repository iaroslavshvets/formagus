import {fireEvent} from '@testing-library/react';

export const createInputAdapterDriver = (options: {wrapper: HTMLElement; dataHook: string}) => {
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
        return API.get.inputNode()!.value;
      },
      meta: (key: string) => {
        return API.get.root()?.querySelector(`[data-hook="meta_${key}"]`)!.textContent;
      },
      errors: (key: string) => {
        const error = API.get.root()?.querySelector(`[data-hook="error:${key}"]`);

        return error ? error.textContent : null;
      },
    },

    when: {
      setCustomState: () => {
        fireEvent.click(API.get.root()?.querySelector(`[data-hook="set-custom-state"]`)!);
      },
      clickOnCallback: () => {
        fireEvent.click(API.get.root()?.querySelector(`[data-hook="callback"]`)!);
      },
      focus: () => {
        fireEvent.focus(API.get.input());
      },
      blur: () => {
        fireEvent.blur(API.get.input());
      },
      validate: () => {
        fireEvent.click(API.get.root()?.querySelector(`[data-hook="validate"]`)!);
      },
      change: (value: string) => {
        API.when.focus();
        fireEvent.change(API.get.input(), {target: {value}});
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
    },
  };
};
