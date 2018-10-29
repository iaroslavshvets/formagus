import * as React from 'react';
import {toJS, computed} from 'mobx';
import {inject, observer} from 'mobx-react';
import {FormController, FormField, FormMeta} from '../FormController';

export type ValidationFunction =
  | ((value: any, values?: any) => any | null)
  | ((value: any, values?: any) => Promise<any | null>);

export type FieldAdapter = ((adapterProps: AdapterProps) => JSX.Element) | React.ComponentClass<any> | React.SFC<any>;

export interface AdapterMetaInfo {
  errors: any | null;
  isDirty: boolean;
  isTouched: boolean;
  isActive: boolean;
  isValidating: boolean;
  isRegistered: boolean;
  custom: {[key: string]: any};
  form: FormMeta;
}

export interface AdapterProps {
  broform?: {
    name: string;
    meta: AdapterMetaInfo;
    value: any;
    setCustomState: (key: string, value: any) => void;
    setFormCustomState: (key: string, value: any) => void;
    onChange: (value: any) => void;
    onFocus: () => void;
    onBlur: () => void;
    validate: () => void;
  };
}

export type FormatterFunction = (value: any) => any;
export type EqualityCheckFunction = (newValue: any, oldValue: any) => boolean;

export interface InjectedFieldProps {
  controller?: FormController;
}

export interface OwnFieldProps {
  name: string;
  children?: (injectedAdapterProps: AdapterProps) => JSX.Element;
  adapter?: FieldAdapter;
  defaultValue?: any;
  onValidate?: ValidationFunction;
  onFormat?: FormatterFunction;
  onEqualityCheck?: EqualityCheckFunction;
  persist?: boolean;
  adapterProps?: any;
}

export interface FieldProps extends InjectedFieldProps, OwnFieldProps {}

@inject('controller')
@observer
export class Field extends React.Component<FieldProps> {
  static defaultProps: Partial<FieldProps> = {
    onEqualityCheck: (newValue: any, oldValue: any) => newValue === oldValue,
    persist: false,
  };

  //meta info passed to Adapter
  @computed
  protected get meta(): AdapterMetaInfo {
    const controller = this.props.controller!;
    const {meta, errors} = this.field;

    const adapterErrors = toJS(errors);
    const custom = toJS(meta.custom);

    return {
      custom,
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

  //custom state for field, passed to adapter
  protected setCustomState = (key: string, value: any) => {
    this.props.controller!.setFieldCustomState(this.props.name, key, value);
  };

  //focus handler, passed to adapter
  protected onFocus = (): void => {
    this.props.controller!.changeFieldActiveState(this.props.name, true);
  };

  //blur handler, passed to adapter
  protected onBlur = (): void => {
    this.props.controller!.changeFieldActiveState(this.props.name, false);
  };

  //value change handler, passed to adapter
  protected onChange = (value: any): void => {
    this.props.controller!.changeFieldValue(this.props.name, value);
  };

  //registers Field in FormController
  componentDidMount() {
    this.props.controller!.registerField(this, this.props);
  }

  //unregisters Field in FormController
  componentWillUnmount() {
    this.props.controller!.unRegisterField(this.props.name);
  }

  //render the adapter passed as `adapter` prop  with optional `adapterProps` prop,
  //or as children render function, broform prop is injected either way, but `adapterProps` are not passed in second case.
  render() {
    if (!this.field) {
      return null;
    }

    const {name} = this.props;
    const controller = this.props.controller!;

    const injectedAdapterProps: AdapterProps = {
      broform: {
        name,
        meta: this.meta,
        value: this.value,
        onChange: this.onChange,
        setCustomState: this.setCustomState,
        onFocus: this.onFocus,
        setFormCustomState: controller.setFormCustomState,
        onBlur: this.onBlur,
        validate: controller.validate,
      },
    };

    return this.props.adapter ? (
      <this.props.adapter {...injectedAdapterProps} {...this.props.adapterProps} />
    ) : (
      this.props.children!(injectedAdapterProps)
    );
  }
}
