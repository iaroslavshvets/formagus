import type {FieldProps} from './Field.types';
import {useFormController} from '../Form';
import React, {useEffect, useState} from 'react';
import {FieldComputedProps} from './Field.ComputedProps';

export const useField = (props: FieldProps) => {
  const controller = useFormController();
  const [fieldComputedProps] = useState(() => new FieldComputedProps(controller, props.name));

  useEffect(() => {
    controller.registerField(props);
    if (props.onInit) {
      props.onInit(fieldComputedProps.formagus!);
    }
    return () => {
      controller.unRegisterField(props.name);
    };
  }, []);

  const {formagus, field} = fieldComputedProps;

  return {
    isReady: field !== undefined,
    formagus,
  };
};
