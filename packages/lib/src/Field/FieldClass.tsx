import React from 'react';
import {toJS, computed} from 'mobx';
import {Observer} from 'mobx-react';
import type {FormController, FormField} from '../FormController';
import type {AdapterProps, FieldMeta, FieldProps} from './Field.types';

export class FieldClass extends React.Component<FieldProps & {controller?: FormController}> {
  //meta info passed to Adapter
  @computed
  protected get meta(): FieldMeta {
    const controller = this.props.controller!;
    const {meta, errors} = this.field;

    const adapterErrors = toJS(errors);
    const customState = toJS(meta.customState);

    return {
      customState,
      errors: adapterErrors,
      isActive: meta.isActive,
      isDirty: meta.isDirty,
      isTouched: meta.isTouched,
      isValidating: meta.isValidating,
      isRegistered: meta.isRegistered,
      form: {
        isSubmitting: controller.isSubmitting,
        isValidating: controller.isValidating,
        isValid: controller.isValid,
        isDirty: controller.isDirty,
        isTouched: controller.isTouched,
        submitCount: controller.submitCount,
      },
    };
  }

  //field value, passed to adapter
  @computed
  protected get value(): any {
    return toJS(this.field.value, {
      detectCycles: false,
    });
  }

  @computed
  get field(): FormField {
    return this.props.controller!.fields.get(this.props.name) as FormField;
  }

  @computed
  get injectedAdapterProps(): AdapterProps {
    return {
      formagus: {
        name: this.props.name,
        meta: this.meta,
        value: this.value,
        onChange: this.onChange,
        setCustomState: this.setCustomState,
        onFocus: this.onFocus,
        onBlur: this.onBlur,
        validate: this.props.controller!.validate,
      },
    };
  }

  //custom state for field, passed to adapter
  protected setCustomState = (key: string, value: any) => {
    this.props.controller!.setFieldCustomState(this.props.name, key, value);
  };

  //focus handler, passed to adapter
  protected onFocus = () => {
    this.props.controller!.changeFieldActiveState(this.props.name, true);
  };

  //blur handler, passed to adapter
  protected onBlur = () => {
    this.props.controller!.changeFieldActiveState(this.props.name, false);
  };

  //value change handler, passed to adapter
  protected onChange = (value: any) => {
    this.props.controller!.setFieldValue(this.props.name, value);
  };

  //called when field is initialized
  protected onInit = (callback: Function) => callback();

  //registers Field in FormController
  componentDidMount() {
    this.props.controller!.registerField(this, this.props);
    if (this.props.onInit) {
      this.props.onInit();
    }
  }

  //unregisters Field in FormController
  componentWillUnmount() {
    this.props.controller!.unRegisterField(this.props.name);
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

          return this.props.adapter ? (
            <this.props.adapter {...this.injectedAdapterProps} {...this.props.adapterProps} />
          ) : (
            this.props.children!(this.injectedAdapterProps)
          );
        }}
      </Observer>
    );
  }
}
