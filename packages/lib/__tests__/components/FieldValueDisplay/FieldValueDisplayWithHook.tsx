import React from 'react';
import {Observer} from 'mobx-react';
import {useFormApi} from '../../../src/useFormApi';

export const FieldValueDisplayWithHook: React.FC<{
  dataHook: string;
  displayedFieldName: string;
}> = (props) => {
  const formApi = useFormApi();

  return (
    <Observer>
      {() => <div data-hook={props.dataHook}>{formApi.values[props.displayedFieldName]}</div>}
    </Observer>
  );
}
