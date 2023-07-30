import {useContext} from 'react';
import {FieldContext} from './Field/FieldContext';

export const useField = () => {
  return useContext(FieldContext)!;
};
