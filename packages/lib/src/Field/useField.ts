import {useEffect} from 'react';
import {computed} from 'mobx';
import {useFormController} from '../Form/useFormController';
import type {FormField} from '../FormController';
import {toJSCompat} from '../utils/toJSCompat';
import type {AdapterProps, FieldCommonProps} from './Field.types';

export const useField = (props: FieldCommonProps) => {
  const controller = useFormController(props);

  const computedField = computed(() => controller!.fields.get(props.name) as FormField);
  const field = computedField.get();
  const isReady = field !== undefined;

  const formagus = computed<Required<AdapterProps['formagus']>>(() => {
    if (!isReady) {
      // component is not yet registered
      return undefined;
    }

    const {meta, errors} = field;

    return {
      name: props.name,
      value: toJSCompat(field.value, false),
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
      ...field.handlers,
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
