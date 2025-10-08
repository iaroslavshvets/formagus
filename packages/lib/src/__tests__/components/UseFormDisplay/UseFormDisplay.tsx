import React from 'react';
import {useForm} from '../../../useForm';
import {observer} from 'mobx-react-lite';

export const UseFormDisplay = observer((props: {dataHook: string}) => {
  const {dataHook} = props;
  const formApi = useForm();

  return <div data-hook={dataHook}>{JSON.stringify(formApi.controller.options)}</div>;
});
