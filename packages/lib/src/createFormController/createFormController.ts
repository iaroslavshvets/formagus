import type {FormControllerOptions} from '../FormControllerClass/FormControllerClass.types';
import {FormControllerClass} from '../FormControllerClass/FormControllerClass';

export const createFormController = (options: FormControllerOptions, ControllerClass = FormControllerClass) => {
  return new ControllerClass(options) as Pick<InstanceType<typeof ControllerClass>, 'API'>;
};
