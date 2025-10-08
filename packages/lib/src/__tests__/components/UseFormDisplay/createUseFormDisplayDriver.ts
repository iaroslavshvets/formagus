import {type FormApi} from '../../../FormControllerClass/FormControllerClass.types';
import {getBase} from '../../helpers/getBase';

export const createUseFormDisplayDriver = (options: {wrapper: Element; dataHook: string}) => {
  const {wrapper, dataHook} = options;

  return {
    getValue: (key: keyof FormApi['controller']['options']) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      return JSON.parse(getBase(wrapper, dataHook).innerHTML)[key];
    },
  };
};
