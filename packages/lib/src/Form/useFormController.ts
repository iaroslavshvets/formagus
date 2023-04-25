import {useContext} from 'react';
import {FormControllerContext} from './FormControllerContext';
import type {FormControllerClass} from '../FormController/FormControllerClass';

export const useFormController = (props?: {controller?: FormControllerClass}) => {
  const controllerFromContext = useContext(FormControllerContext);

  return props?.controller || controllerFromContext;
};
