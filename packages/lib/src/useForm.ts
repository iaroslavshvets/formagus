import {useContext} from 'react';
import {FormControllerContext} from './Form/FormControllerContext';
import type {FormController} from './createFormController/createFormController.types';

export const useForm = (props?: {controller?: FormController}) => {
  const controllerFromContext = useContext(FormControllerContext);

  return ((props?.controller || controllerFromContext) as FormController).API;
};
