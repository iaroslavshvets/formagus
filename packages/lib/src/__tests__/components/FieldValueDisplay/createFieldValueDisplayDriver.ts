import {getBase} from '../../helpers/getBase';

export const createFieldValueDisplayDriver = (options: {wrapper: Element; dataHook: string}) => {
  const {wrapper, dataHook} = options;

  return {
    getText: () => {
      return getBase(wrapper, dataHook).textContent;
    },
  };
};
