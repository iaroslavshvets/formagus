import React from 'react';
import {useFormController} from '../Form';
import {observer} from 'mobx-react';
import type {FormProps} from '../Form';

export const FormPart = observer((props: {children: FormProps['children']}) => {
  const controller = useFormController();

  return props.children(controller.API);
});

(FormPart as any).displayName = 'FormagusFormPart';
