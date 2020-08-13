import {FormAPI, FormController} from '../FormController';
import type {FormControllerOptions} from '../FormController';

export interface FormProps extends FormControllerOptions {
  children: (renderProps: FormAPI) => JSX.Element;
  controller?: FormController;
}
