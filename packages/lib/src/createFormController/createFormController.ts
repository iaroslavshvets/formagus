import type {FormControllerOptions} from '../FormController/FormController.types';
import {FormControllerClass} from '../FormController/FormControllerClass';

export const createFormController = (options: FormControllerOptions, ControllerClass = FormControllerClass) => {
  return new ControllerClass(options) as Omit<
    InstanceType<typeof ControllerClass>,
    'registerField' | 'unRegisterField'
  >;
};
