import React from 'react';
import {observer} from 'mobx-react';
import {useForm} from '../../../src';

export const FieldValueDisplayWithHook = observer((props: {dataHook: string; displayedFieldName: string}) => {
  const form = useForm();

  return <div data-hook={props.dataHook}>{form.values[props.displayedFieldName]}</div>;
});
