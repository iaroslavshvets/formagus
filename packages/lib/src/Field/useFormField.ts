import {useContext} from 'react';
import {FieldContext} from './FieldContext';
import {FormagusProps} from './Field.types';

export const useFormField = () => {
  return useContext(FieldContext) as FormagusProps;
};
