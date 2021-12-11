import React from 'react';
import type {FieldProps} from './Field.types';
import {FieldClass} from './FieldClass';
import {useFormController} from '../Form';
import isEmpty from 'lodash/isEmpty';

export const Field = (props: FieldProps) => {
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

Field.displayName = 'FormagusField';