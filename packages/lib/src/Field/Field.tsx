import React from 'react';
import {observer} from 'mobx-react';
import type {JSXElementConstructor} from 'react';
import {useRegisterField} from './useRegisterField';
import {FieldContextProvider} from './FieldContext';
import type {FieldProps} from './Field.types';

export const Field = observer(<T extends JSXElementConstructor<any>>(props: FieldProps<T>) => {
  const {formagus} = useRegisterField(props as Omit<FieldProps<T>, 'controller'>);

  if (!formagus) {
    return null;
  }

  if (props.adapter) {
    const Adapter: any = props.adapter;
    return (
      <FieldContextProvider value={formagus}>
        <Adapter formagus={formagus} {...props.adapterProps} />
      </FieldContextProvider>
    );
  }

  if (props.render) {
    return <FieldContextProvider value={formagus}>{props.render({formagus: formagus!})}</FieldContextProvider>;
  }

  return <FieldContextProvider value={formagus}>{props.children}</FieldContextProvider>;
});

(Field as any).displayName = 'FormagusField';
