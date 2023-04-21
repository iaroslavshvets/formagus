import React from 'react';
import type {ComponentProps, JSXElementConstructor} from 'react';
import type {FormController, FieldErrors, FormMeta, CreateFormController} from '../FormController';

export type ValidationFunction =
  | ((value: any, values?: any) => FieldErrors)
  | ((value: any, values?: any) => Promise<FieldErrors>);

export type FieldAdapter = React.ComponentClass<AdapterProps> | React.FC<AdapterProps>;

export type FieldMeta = Readonly<{
  errors: any | null;
  initialValue: any;
  isDirty: boolean;
  isTouched: boolean;
  isChanged: boolean;
  isActive: boolean;
  isValidating: boolean;
  customState: Record<string, any>;
  form: FormMeta;
}>;

export type AdapterRenderProps = Required<AdapterProps>;

export type FormagusProps = Readonly<{
  name: string;
  meta: FieldMeta;
  value: any;
  setCustomState: (key: string, value: any) => void;
  onChange: (value: any) => void;
  onFocus: () => void;
  onBlur: () => void;
  validate: () => Promise<void>;
  validateField: () => Promise<void>;
}>;

export type AdapterProps = {
  formagus?: FormagusProps;
};

export type FormatterFunction = (value: any) => any;
export type EqualityCheckFunction = (newValue: any, oldValue: any) => boolean;

export type FieldCommonProps = {
  name: string;
  defaultValue?: any;
  onValidate?: ValidationFunction;
  onFormat?: FormatterFunction;
  onEqualityCheck?: EqualityCheckFunction;
  onInit?: (API: FormagusProps) => void;
  persist?: boolean;
  controller?: FormController;
};

// eslint-disable-next-line  @typescript-eslint/no-unused-vars
export type FieldProps<T extends JSXElementConstructor<any> = any> = Omit<FieldCommonProps, 'controller'> & {
  controller?: CreateFormController;
  children?: JSX.Element;
  render?: (injectedAdapterProps: AdapterRenderProps) => JSX.Element;
  adapter?: React.ComponentClass<AdapterProps & ComponentProps<T>> | React.FC<AdapterProps & ComponentProps<T>>;
  adapterProps?: ComponentProps<T>; // Will be passed to adapter alongside injected formagus props
};
