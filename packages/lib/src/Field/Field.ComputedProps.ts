import {computed} from 'mobx';
import {toJSCompat} from '../utils/toJSCompat';
import {makeObservableForMobx6} from '../utils/makeObservableForMobx6';
import type {FormController, FormField} from '../FormController';
import type {AdapterProps} from './Field.types';

export class FieldComputedProps {
  @computed
  get field() {
    return this.controller!.fields.get(this.name) as FormField;
  }

  @computed
  get formagusProps(): Required<AdapterProps> {
    if (!this.field) {
      // component is not yet registered
      return undefined as any;
    }
    const {controller} = this;
    const {meta, errors} = this.field;

    return {
      formagus: {
        name: this.name,
        value: toJSCompat(this.field.value, false),
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
        onChange: this.field.handlers.onChange,
        setCustomState: this.field.handlers.setCustomState,
        onFocus: this.field.handlers.onFocus,
        onBlur: this.field.handlers.onBlur,
        validateField: this.field.handlers.validateField,
        validate: this.field.handlers.validate,
      },
    };
  }

  constructor(private controller: FormController, private name: string) {
    makeObservableForMobx6(this);
  }
}
