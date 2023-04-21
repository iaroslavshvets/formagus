import type {CreateFormController, FormAPI, FormControllerOptions} from '../FormController';

export interface FormProps extends FormControllerOptions {
  children: (renderProps: FormAPI) => JSX.Element;
  controller?: CreateFormController;
}
