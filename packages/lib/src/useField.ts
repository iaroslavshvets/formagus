import {useContext} from 'react';
import {FieldContext} from './Field/FieldContext';
import type {FieldFormagus} from './Field/Field.types';

export const useField = () => {
  return useContext(FieldContext) as FieldFormagus;
};
