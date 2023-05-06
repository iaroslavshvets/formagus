import type {FormControllerOptions} from '../FormControllerClass/FormControllerClass.types';
import {FormControllerClass} from '../FormControllerClass/FormControllerClass';
import {FormAPI} from '../FormControllerClass/FormControllerClass.types';

export const createFormController = (options: FormControllerOptions, ControllerClass = FormControllerClass) => {
  return new ControllerClass(options) as {API: FormAPI};
};
