import isEmpty from 'lodash/isEmpty';
import React from 'react';
import {useFormController} from '../Form';
import {FieldClass} from './FieldClass';
import type {FieldProps} from './Field.types';

export const Field: React.FC<FieldProps> = (props) => {
  const controller = useFormController();

  const {
    onEqualityCheck = (newValue: any, oldValue: any) => {
      return newValue === oldValue || (isEmpty(newValue) && isEmpty(oldValue));
    },
    persist = false,
    ...restProps
  } = props;

  return <FieldClass controller={controller} onEqualityCheck={onEqualityCheck} persist={persist} {...restProps} />;
};
