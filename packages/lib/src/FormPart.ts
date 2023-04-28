import {observer} from 'mobx-react';
import {useFormControllerClass} from './Form/useFormControllerClass';
import type {FormProps} from './Form/Form.types';

export const FormPart = observer((props: {children: FormProps['children']}) => {
  const controller = useFormControllerClass();

  return props.children(controller.API);
});

(FormPart as any).displayName = 'FormagusFormPart';
