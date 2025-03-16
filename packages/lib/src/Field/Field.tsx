import React from 'react';
import {observer} from 'mobx-react-lite';
import {useRegisterField} from './useRegisterField';
import {FieldContextProvider} from './FieldContext';
import {type FieldProps} from './Field.types';

export const Field = observer((props: FieldProps) => {
  const {fieldApi} = useRegisterField(props as Omit<FieldProps, 'controller'>);

  if (!fieldApi) {
    return null;
  }

  if (props.render) {
    if (props.children) {
      throw new Error('You cannot use both render and children prop');
    }
    return <FieldContextProvider value={fieldApi}>{props.render({field: fieldApi})}</FieldContextProvider>;
  }

  return <FieldContextProvider value={fieldApi}>{props.children}</FieldContextProvider>;
});

Field.displayName = 'FormagusField';
