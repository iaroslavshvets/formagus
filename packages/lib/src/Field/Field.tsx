import React, {ComponentProps, JSXElementConstructor} from 'react';
import {observer} from 'mobx-react';
import {useField} from './useField';
import type {FieldProps} from './Field.types';

export const Field = observer(<T extends JSXElementConstructor<any>>(props: FieldProps<T>) => {
  const {isReady, formagus} = useField(props);

  if (!isReady) {
    return null;
  }

  const hasAdapterComponent = 'adapter' in props && props.adapter !== undefined;

  if (hasAdapterComponent) {
    const Adapter: any = props.adapter;
    return <Adapter formagus={formagus} {...props.adapterProps} />;
  }

  return props.children!({formagus: formagus!});
});

(Field as any).displayName = 'FormagusField';
