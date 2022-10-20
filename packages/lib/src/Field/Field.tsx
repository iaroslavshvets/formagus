import React, {useEffect} from 'react';
import type {FieldProps} from './Field.types';
import {FieldClass} from './FieldClass';
import {useFormController} from '../Form';
import {memo} from 'react';

export const Field = memo((props: FieldProps) => {
  const controller = useFormController();

  useEffect(() => {
    controller.registerField(props);
    return () => {
      controller.unRegisterField(props.name);
    };
  }, []);

  return <FieldClass controller={controller} {...props} />;
});

Field.displayName = 'FormagusField';
