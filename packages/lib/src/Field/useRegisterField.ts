import {useEffect} from 'react';
import {computed} from 'mobx';
import {useFormControllerClass} from '../Form/useFormControllerClass';
import {toJSCompat} from '../utils/toJSCompat';
import {type FieldCommonProps, type FieldFormagus} from './Field.types';

export const useRegisterField = (props: FieldCommonProps) => {
  const controller = useFormControllerClass(props);
  const field = controller.fields.get(props.name);
  const isReady = field !== undefined;

  const formagus = computed<FieldFormagus | undefined>(() => {
    if (!isReady) {
      // component is not yet registered
      return undefined;
    }

    const {fieldState} = field;

    const safeErrors = toJSCompat(field.errors);

    const safeValue = toJSCompat(field.value);

    return {
      name: props.name,
      value: safeValue,
      errors: safeErrors,
      fieldProps: props,
      fieldState: {
        initialValue: fieldState.initialValue,
        isActive: fieldState.isActive,
        isDirty: fieldState.isDirty,
        isTouched: fieldState.isTouched,
        isChanged: fieldState.isChanged,
        isValidating: fieldState.isValidating,
        isMounted: fieldState.isMounted,
      },
      validateField: field.validateField,
      validate: field.validate,
      onChange: field.onChange,
      onFocus: field.onFocus,
      onBlur: field.onBlur,
    };
  });

  useEffect(() => {
    controller.registerField(props);
    return () => {
      controller.unRegisterField(props.name);
    };
  }, []);

  useEffect(() => {
    if (isReady) {
      props.onInit?.(formagus.get()!);
    }
  }, [isReady]);

  return {
    isReady,
    formagus: formagus.get(),
  };
};
