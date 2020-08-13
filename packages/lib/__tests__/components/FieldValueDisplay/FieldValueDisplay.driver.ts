export const createFieldValueDisplayDriver = (options: {wrapper: HTMLElement; dataHook: string}) => {
  const {wrapper, dataHook} = options;

  const API = {
    get: {
      root: () => {
        return wrapper.querySelector(`[data-hook="${dataHook}"]`);
      },
      text: () => {
        return API.get.root()?.textContent;
      },
    },
  };

  return {
    get: {text: API.get.text},
  };
};
