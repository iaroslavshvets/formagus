import React from 'react';
import {observer} from 'mobx-react-lite';
import {useRegisterField} from './useRegisterField';
import {FieldContextProvider} from './FieldContext';
import {type FieldProps} from './Field.types';
import {invariant} from '../utils/invariant';

export const Field = observer((props: FieldProps) => {
  const {formagus} = useRegisterField(props as Omit<FieldProps, 'controller'>);

  if (!formagus) {
    return null;
  }

  if (props.render) {
    invariant(props.children === undefined, 'You cannot use both render and children prop');

    return <FieldContextProvider value={formagus}>{props.render({formagus})}</FieldContextProvider>;
  }

  return <FieldContextProvider value={formagus}>{props.children}</FieldContextProvider>;
});

Field.displayName = 'FormagusField';
