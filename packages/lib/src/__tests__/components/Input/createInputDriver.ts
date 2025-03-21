import {fireEvent} from '@testing-library/react';

export const createInputDriver = (options: {wrapper: Element; dataHook: string}) => {
  const {wrapper, dataHook} = options;

  const API = {
    get: {
      root: () => {
        return wrapper.querySelector(`[data-hook="${dataHook}"]`);
      },
      input: () => {
        //eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
        return API.get.root()?.querySelector<HTMLInputElement>(`[data-hook="input-${dataHook}"]`)!;
      },
      inputNode: () => {
        return API.get.input();
      },
      value: () => {
        return API.get.inputNode().value;
      },
      fieldState: (key: string) => {
        return API.get.root()?.querySelector(`[data-hook="field_state_${key}"]`)!.textContent;
      },
      formState: (key: string) => {
        return API.get.root()?.querySelector(`[data-hook="form_state_${key}"]`)!.textContent;
      },
      errors: (key?: string) => {
        if (key) {
          const error = API.get.root()?.querySelector(`[data-hook="error:${key}"]`);

          return error ? error.textContent : null;
        }
        //eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
        const errors = Array.from(API.get.root()?.querySelectorAll(`[data-hook^="error:"]`)!);

        return errors.length
          ? errors.map((error) => {
              return error.textContent;
            })
          : null;
      },
    },

    when: {
      focus: async () => {
        return fireEvent.focus(API.get.input());
      },
      blur: async () => {
        return fireEvent.blur(API.get.input());
      },
      validate: async () => {
        //eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
        return fireEvent.click(API.get.root()?.querySelector(`[data-hook="validate"]`)!);
      },
      validateField: async () => {
        //eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
        return fireEvent.click(API.get.root()?.querySelector(`[data-hook="validate-field"]`)!);
      },
      change: async (value: string) => {
        await API.when.focus();
        return fireEvent.change(API.get.input(), {target: {value}});
      },
    },
  };

  return {
    get: {
      value: API.get.value,
      fieldState: API.get.fieldState,
      formState: API.get.formState,
      errors: API.get.errors,
    },
    when: {
      focus: API.when.focus,
      blur: API.when.blur,
      validate: API.when.validate,
      change: API.when.change,
      validateField: API.when.validateField,
    },
  };
};
