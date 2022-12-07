import {useFormController} from '../Form';
import React, {useEffect} from 'react';
import {computed} from 'mobx';
import {FormField} from '../FormController';
import {toJSCompat} from '../utils/toJSCompat';
import type {AdapterProps, FieldCommonProps} from './Field.types';

export const useField = (props: FieldCommonProps) => {
  const controller = useFormController(props);

  const field = computed(() => controller!.fields.get(props.name) as FormField);

  const formagus = computed<Required<AdapterProps['formagus']>>(() => {
    const fieldValue = field.get();

    if (!fieldValue) {
      // component is not yet registered
      return undefined as any;
    }

    const {meta, errors} = fieldValue;

    return {
      name: props.name,
      value: toJSCompat(fieldValue.value, false),
      meta: {
        customState: toJSCompat(meta.customState),
        errors: toJSCompat(errors),
        initialValue: meta.initialValue,
        isActive: meta.isActive,
        isDirty: meta.isDirty,
        isTouched: meta.isTouched,
        isChanged: meta.isChanged,
        isValidating: meta.isValidating,
        form: {
          isSubmitting: controller.isSubmitting,
          isValidating: controller.isValidating,
          isValid: controller.isValid,
          isDirty: controller.isDirty,
          isTouched: controller.isTouched,
          isChanged: controller.isChanged,
          submitCount: controller.submitCount,
        },
      },
      onChange: fieldValue.handlers.onChange,
      setCustomState: fieldValue.handlers.setCustomState,
      onFocus: fieldValue.handlers.onFocus,
      onBlur: fieldValue.handlers.onBlur,
      validateField: fieldValue.handlers.validateField,
      validate: fieldValue.handlers.validate,
    };
  });

  useEffect(() => {
    controller.registerField(props);
    if (props.onInit) {
      props.onInit(formagus.get()!);
    }
    return () => {
      controller.unRegisterField(props.name);
    };
  }, []);

  return {
    isReady: field.get() !== undefined,
    formagus: formagus.get(),
  };
};
