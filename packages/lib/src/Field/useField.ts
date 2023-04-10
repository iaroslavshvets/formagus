import {useEffect} from 'react';
import {computed} from 'mobx';
import {useFormController} from '../Form/useFormController';
import {FormField} from '../FormController';
import {toJSCompat} from '../utils/toJSCompat';
import type {AdapterProps, FieldCommonProps} from './Field.types';

export const useField = (props: FieldCommonProps) => {
  const controller = useFormController(props);

  const computedField = computed(() => controller!.fields.get(props.name) as FormField);
  const field = computedField.get();

  const formagus = computed<Required<AdapterProps['formagus']>>(() => {

    if (!field) {
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
        form: controller.API.meta,
      },
      ...field.handlers,
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
    isReady: field !== undefined,
    formagus: formagus.get(),
  };
};
