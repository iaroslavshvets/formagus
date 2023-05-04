import {useContext} from 'react';
import {FieldContext} from './Field/FieldContext';
import type {FormagusProps} from './Field/Field.types';

export const useField = () => {
  return useContext(FieldContext) as FormagusProps;
};
