import type {FormAPI, FormControllerOptions} from '../FormControllerClass/FormControllerClass.types';
import {FormController} from '../createFormController/createFormController.types';

export interface FormProps extends FormControllerOptions {
  children: (renderProps: FormAPI) => JSX.Element;
  controller?: FormController;
}
