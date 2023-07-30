import {useEffect} from 'react';
import {computed} from 'mobx';
import {useFormControllerClass} from '../Form/useFormControllerClass';
import {toJSCompat} from '../utils/toJSCompat';
import {type FieldCommonProps, type FieldFormagus} from './Field.types';

export const useRegisterField = (props: FieldCommonProps) => {
  const controller = useFormControllerClass(props);

  const computedField = computed(() => controller.fields.get(props.name));

  const field = computedField.get();
  const isReady = field !== undefined;

  const formagus = computed<FieldFormagus | undefined>(() => {
    if (!isReady) {
      // component is not yet registered
      return undefined;
    }

    const {meta, errors} = field;

    const safeErrors = toJSCompat(errors);
    const safeValue = toJSCompat(field.value, false);
    const safeCustomState = toJSCompat(meta.customState);

    return {
      name: props.name,
      value: safeValue,
      errors: safeErrors,
      fieldProps: props,
      meta: {
        /** @deprecated don't use */
        customState: safeCustomState,
        initialValue: meta.initialValue,
        isActive: meta.isActive,
        isDirty: meta.isDirty,
        isTouched: meta.isTouched,
        isChanged: meta.isChanged,
        isValidating: meta.isValidating,
        isMounted: meta.isMounted,
      },
      /** @deprecated */
      setCustomState: field.setCustomState,
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
    if (isReady && props.onInit) {
      props.onInit(formagus.get()!);
    }
  }, [isReady]);

  return {
    isReady,
    formagus: formagus.get(),
  };
};
