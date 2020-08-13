import React, {FC} from 'react';
import {Observer} from 'mobx-react';
import {useFormController} from '../Form';
import type {FormProps} from '../Form';

export const FormPart: FC<Pick<FormProps, 'children'>> = (props) => {
  const controller = useFormController();

  return <Observer>{() => props.children(controller.API)}</Observer>;
};
