import React from 'react';
import {observer} from 'mobx-react';
import type {JSXElementConstructor} from 'react';
import {useField} from './useField';
import type {FieldProps} from './Field.types';
import {FieldContextProvider} from './FieldContext';

export const Field = observer(<T extends JSXElementConstructor<any>>(props: FieldProps<T>) => {
  const {isReady, formagus} = useField(props);

  if (!isReady) {
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
