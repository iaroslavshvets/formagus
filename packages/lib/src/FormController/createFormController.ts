import type {FormControllerOptions} from './FormController.types';
import {FormController} from './FormController';

export const createFormController = (options: FormControllerOptions, ControllerClass = FormController) => {
  return new ControllerClass(options) as Omit<
    InstanceType<typeof ControllerClass>,
    'registerField' | 'unRegisterField'
  >;
};
