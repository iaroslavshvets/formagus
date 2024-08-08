import React, {type ElementType} from 'react';
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

  if (props.adapter) {
    invariant(
      props.children === undefined && props.render === undefined,
      'You cannot use both adapter and render or children prop',
    );

    const Adapter: ElementType<any> = props.adapter;
    return (
      <FieldContextProvider value={formagus}>
        <Adapter formagus={formagus} {...props.adapterProps} />
      </FieldContextProvider>
    );
  }

  if (props.render) {
    invariant(props.children === undefined, 'You cannot use both render and children prop');

    return <FieldContextProvider value={formagus}>{props.render({formagus})}</FieldContextProvider>;
  }

  return <FieldContextProvider value={formagus}>{props.children}</FieldContextProvider>;
});

Field.displayName = 'FormagusField';
