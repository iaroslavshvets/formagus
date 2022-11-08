import React from 'react';
import type {FieldProps} from './Field.types';
import {observer} from 'mobx-react';
import {useField} from './useField';

export const Field = observer((props: FieldProps) => {
  const {isReady, formagusProps} = useField(props);

  if (!isReady) {
    return <></>;
  }

  const hasAdapterComponent = 'adapter' in props && props.adapter !== undefined;
  const Adapter: any = props.adapter;

  return hasAdapterComponent ? <Adapter {...formagusProps} {...props.adapterProps} /> : props.children!(formagusProps);
});

(Field as any).displayName = 'FormagusField';
