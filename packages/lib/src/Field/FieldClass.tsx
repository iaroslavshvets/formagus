import React from 'react';
import {computed} from 'mobx';
import {Observer} from 'mobx-react';
import type {FormController, FormField} from '../FormController';
import type {AdapterProps, FieldMeta, FieldProps} from './Field.types';
import {toJSCompat} from '../utils/toJSCompat';

export class FieldClass extends React.Component<FieldProps & {controller: FormController}> {
  //meta info passed to Adapter
  @computed
  protected get meta(): FieldMeta {
    const {controller} = this.props;
    const {meta, errors} = this.field;

    const adapterErrors = toJSCompat(errors);
    const customState = toJSCompat(meta.customState);

    return {
      customState,
      errors: adapterErrors,
      initialValue: meta.initialValue,
      isActive: meta.isActive,
      isDirty: meta.isDirty,
      isTouched: meta.isTouched,
      isChanged: meta.isChanged,
      isValidating: meta.isValidating,
      isRegistered: meta.isRegistered,
      form: {
        isSubmitting: controller.isSubmitting,
        isValidating: controller.isValidating,
        isValid: controller.isValid,
        isDirty: controller.isDirty,
        isTouched: controller.isTouched,
        isChanged: controller.isChanged,
        submitCount: controller.submitCount,
      },
    };
  }

  //field value, passed to adapter
  @computed
  protected get value() {
    return toJSCompat(this.field.value, false);
  }

  @computed
  get field() {
    return this.props.controller!.fields.get(this.props.name) as FormField;
  }

  @computed
  get injectedAdapterProps(): Required<AdapterProps> {
    return {
      formagus: {
        name: this.props.name,
        value: this.value,
        meta: this.meta,
        onChange: this.field.handlers.onChange,
        setCustomState: this.field.handlers.setCustomState,
        onFocus: this.field.handlers.onFocus,
        onBlur: this.field.handlers.onBlur,
        validate: this.props.controller!.validate,
      },
    };
  }

  //render the adapter passed as `adapter` prop  with optional `adapterProps` prop,
  //or as children render function, formagus prop is injected either way, but `adapterProps` are not passed in second case.
  render() {
    return (
      <Observer>
        {() => {
          if (!this.field) {
            return <></>;
          }

          const hasAdapterComponent = 'adapter' in this.props && this.props.adapter !== undefined;
          const Adapter: any = this.props.adapter;

          return hasAdapterComponent ? (
            <Adapter {...this.injectedAdapterProps} {...this.props.adapterProps} />
          ) : (
            this.props.children!(this.injectedAdapterProps)
          );
        }}
      </Observer>
    );
  }
}
