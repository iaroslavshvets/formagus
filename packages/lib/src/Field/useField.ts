import {useEffect} from 'react';
import {computed} from 'mobx';
import {useFormController} from '../Form/useFormController';
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
      return undefined;
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
          isSubmitting: controller.API.meta.isSubmitting,
          isValidating: controller.API.meta.isValidating,
          isValid: controller.API.meta.isValid,
          isDirty: controller.API.meta.isDirty,
          isTouched: controller.API.meta.isTouched,
          isChanged: controller.API.meta.isChanged,
          submitCount: controller.API.meta.submitCount,
        },
      },
      ...fieldValue.handlers,
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
