import React from 'react';
import {observer} from 'mobx-react-lite';
import {useRegisterField} from './useRegisterField';
import {FieldContextProvider} from './FieldContext';
import {type FieldProps} from './Field.types';

export const Field = observer((props: FieldProps) => {
  const field = useRegisterField(props as Omit<FieldProps, 'controller'>);

  if (props.render && props.children) {
    throw new Error('You cannot use both render and children prop');
  }

  if (!field) {
    return null;
  }

  return (
    <FieldContextProvider value={field}>{props.render ? props.render({field}) : props.children}</FieldContextProvider>
  );
});

Field.displayName = 'FormagusField';
