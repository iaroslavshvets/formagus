import type {FormAPI, FormController, FormControllerOptions} from '../FormController';

export interface FormProps extends FormControllerOptions {
  children: (renderProps: FormAPI) => JSX.Element;
  controller?: FormController;
}
