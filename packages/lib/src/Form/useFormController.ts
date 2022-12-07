import {useContext} from 'react';
import {FormControllerContext} from './FormControllerContext';
import type {FormController} from '../FormController';

export const useFormController = (props?: {controller?: FormController}) => {
  const controllerFromContext = useContext(FormControllerContext);

  return props?.controller || controllerFromContext;
};
