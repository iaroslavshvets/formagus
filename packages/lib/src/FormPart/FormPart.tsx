import React from 'react';
import {useFormController} from '../Form';
import type {FormProps} from '../Form';
import {observer} from 'mobx-react-lite';

export const FormPart = observer((props: {children: FormProps['children']}) => {
  const controller = useFormController();

  return props.children(controller.API);
});

FormPart.displayName = 'FormagusFormPart';
