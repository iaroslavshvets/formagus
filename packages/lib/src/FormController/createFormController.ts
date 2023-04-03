import {FormControllerOptions} from './FormController.types';
import {FormController} from './FormController';

export const createFormController = (options: FormControllerOptions) => {
  return new FormController(options) as Omit<
    InstanceType<typeof FormController>,
    'fields' | 'registerField' | 'unRegisterField'
  >;
};
