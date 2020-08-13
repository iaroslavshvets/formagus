import {useContext} from 'react';
import {FormControllerContext} from './FormControllerContext';

export const useFormController = () => {
  return useContext(FormControllerContext);
};
