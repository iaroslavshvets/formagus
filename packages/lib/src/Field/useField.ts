import {useContext} from 'react';
import {FieldContext} from './FieldContext';
import type {FormagusProps} from './Field.types';

export const useField = () => {
  return useContext(FieldContext) as FormagusProps;
};
