import {useEffect} from 'react';
import {useFormControllerClass} from '../Form/useFormControllerClass';
import {type FieldCommonProps} from './Field.types';

export const useRegisterField = (props: FieldCommonProps) => {
  const controller = useFormControllerClass(props);
  const field = controller.fields.get(props.name);
  const isReady = field !== undefined;

  const fieldApi = (() => {
    if (!isReady) {
      // component is not yet registered
      return undefined;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {onEqualityCheck, isRegistered, ...rest} = field.fieldState;
    const {name} = props;

    return {
      name,
      ...field,
      fieldProps: props,
      fieldState: rest,
    };
  })();

  useEffect(() => {
    if (fieldApi) {
      props.onInit?.(fieldApi);
    }
  }, [fieldApi]);

  useEffect(() => {
    controller.registerField(props);
    return () => {
      controller.unRegisterField(props.name);
    };
  }, []);

  return {
    isReady,
    fieldApi,
  };
};
