import {type FormAPI, type FormControllerOptions} from '../FormControllerClass/FormControllerClass.types';
import {type FormController} from '../createFormController/createFormController.types';

export interface FormProps extends FormControllerOptions {
  children: (renderProps: FormAPI) => JSX.Element;
  controller?: FormController;
}
