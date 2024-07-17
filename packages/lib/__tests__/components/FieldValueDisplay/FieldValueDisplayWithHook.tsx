import React from 'react';
import {observer} from 'mobx-react-lite';
import {get} from 'lodash';
import {useForm} from '../../../src';

export const FieldValueDisplayWithHook = observer((props: {dataHook: string; displayedFieldName: string}) => {
  const form = useForm();

  return <div data-hook={props.dataHook}>{get(form.values, props.displayedFieldName)}</div>;
});
