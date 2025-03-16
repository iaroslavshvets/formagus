import {useEffect} from 'react';
import {useFormControllerClass} from '../Form/useFormControllerClass';
import {type FieldCommonProps} from './Field.types';
import {toJSCompat} from '../utils/toJSCompat';
import {computed} from 'mobx';

export const useRegisterField = (props: FieldCommonProps) => {
  const controller = useFormControllerClass(props);
  const field = controller.fields.get(props.name);
  const isReady = field !== undefined;

  const fieldApi = computed(() => {
    if (isReady) {
      const {fieldState} = field;

      const safeErrors = toJSCompat(field.errors);
      const safeValue = toJSCompat(field.value);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {onEqualityCheck, isRegistered, ...rest} = fieldState;

      return {
        ...field,
        name: props.name,
        value: safeValue,
        errors: safeErrors,
        fieldProps: props,
        fieldState: rest,
      };
    }
    return undefined;
  });

  useEffect(() => {
    if (isReady) {
      props.onInit?.(fieldApi.get()!);
    }
  }, [isReady]);

  useEffect(() => {
    controller.registerField(props);
    return () => {
      controller.unRegisterField(props.name);
    };
  }, []);

  return {
    isReady,
    fieldApi: fieldApi.get()!,
  };
};
