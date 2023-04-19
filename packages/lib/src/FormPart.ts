import {observer} from 'mobx-react';
import {useFormController} from './Form/useFormController';
import type {FormProps} from './Form/Form.types';

export const FormPart = observer((props: {children: FormProps['children']}) => {
  const controller = useFormController();

  return props.children(controller.API)


});

(FormPart as any).displayName = 'FormagusFormPart';
