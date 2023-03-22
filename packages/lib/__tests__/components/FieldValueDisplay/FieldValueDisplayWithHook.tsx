import React from 'react';
import {observer} from 'mobx-react';
import {useFormApi} from '../../../src';

export const FieldValueDisplayWithHook = observer((props: {dataHook: string; displayedFieldName: string}) => {
  const formApi = useFormApi();

  return <div data-hook={props.dataHook}>{formApi.values[props.displayedFieldName]}</div>;
});
