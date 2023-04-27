import {useEffect} from 'react';
import {computed} from 'mobx';
import {useFormControllerClass} from '../Form/useFormControllerClass';
import {toJSCompat} from '../utils/toJSCompat';
import type {FieldCommonProps, FormagusProps} from './Field.types';

export const useRegisterField = (props: FieldCommonProps) => {
  const controller = useFormControllerClass(props);

  const computedField = computed(() => controller!.fields.get(props.name));

  const field = computedField.get();
  const isReady = field !== undefined;

  const formagus = computed<Required<FormagusProps> | undefined>(() => {
    if (!isReady) {
      // component is not yet registered
      return undefined;
    }

    const {meta, errors} = field;
    const hasValidation = meta.isMounted && field.props?.onValidate !== undefined;

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
        hasValidation,
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