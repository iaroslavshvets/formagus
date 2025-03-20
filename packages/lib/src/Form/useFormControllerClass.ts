import {useContext} from 'react';
import {FormControllerContext} from './FormControllerContext';
import {type FormControllerClass} from '../FormControllerClass/FormControllerClass';

export const useFormControllerClass = (props?: {controller?: FormControllerClass}) => {
  const controllerFromContext = useContext(FormControllerContext);

  return props?.controller ?? controllerFromContext;
};
