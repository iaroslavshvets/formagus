import {useEffect} from 'react';
import {useFormControllerClass} from '../Form/useFormControllerClass';
import {type FieldCommonProps} from './Field.types';
import {toJSCompat} from '../utils/toJSCompat';
import {computed} from 'mobx';

export const useRegisterField = (props: FieldCommonProps) => {
  const controller = useFormControllerClass(props);
  const field = controller.fields.get(props.name);
  const isReady = field !== undefined;

  const fieldApi = computed(() =>
    isReady
      ? (() => {
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
        })()
      : undefined,
  );

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
