import {ReactWrapper} from 'enzyme';

export const createFieldValueDisplayDriver = (options: {wrapper: ReactWrapper<any>; dataHook: string}) => {
  const {wrapper, dataHook} = options;

  const API = {
    get: {
      root: () => {
        return wrapper.find(`[data-hook="${dataHook}"]`) as ReactWrapper;
      },
      text: () => {
        return API.get.root().text();
      },
    },
  };

  return {
    get: {text: API.get.text},
  };
};
