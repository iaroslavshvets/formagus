import {useContext} from 'react';
import {FieldContext} from './Field/FieldContext';
import {FormagusProps} from './Field/Field.types';

export const useField = () => {
  return useContext(FieldContext) as FormagusProps;
};
