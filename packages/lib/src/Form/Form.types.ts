import {type FormApi, type FormControllerOptions} from '../FormControllerClass/FormControllerClass.types';
import {type FormController} from '../createFormController/createFormController.types';
import {type ReactNode} from 'react';

export type FormProps = {
  children: (renderProps: FormApi) => ReactNode;
  controller?: FormController;
} & FormControllerOptions;
