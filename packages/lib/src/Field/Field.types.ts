import React from 'react';
import type {ComponentProps, JSXElementConstructor} from 'react';
import type {FieldErrors, FormMeta} from '../FormControllerClass/FormControllerClass.types';
import type {FormController} from '../createFormController/createFormController.types';
import type {FormControllerClass} from '../FormControllerClass/FormControllerClass';

export type ValidationFunction =
  | ((value: any, values?: any) => FieldErrors)
  | ((value: any, values?: any) => Promise<FieldErrors>);

export type FieldMeta = Readonly<{
  errors: any | null;
  initialValue: any;
  isDirty: boolean;
  isTouched: boolean;
  isChanged: boolean;
  isActive: boolean;
  isValidating: boolean;
  hasValidation: boolean;
  customState: Record<string, any>;
  form: FormMeta;
}>;

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

/** @deprecated */
export type AdapterProps = {
  formagus?: FormagusProps;
};

export type FieldRenderProps = {
  formagus: FormagusProps;
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
  controller?: FormControllerClass;
};

// eslint-disable-next-line  @typescript-eslint/no-unused-vars
export type FieldProps<T extends JSXElementConstructor<any> = any> = Omit<FieldCommonProps, 'controller'> & {
  controller?: FormController;
  children?: JSX.Element;
  render?: (injectedFieldDisplayProps: FieldRenderProps) => JSX.Element;
  /** @deprecated pass children and useField hook inside instead, or at least render prop */
  adapter?: React.ComponentClass<AdapterProps & ComponentProps<T>> | React.FC<AdapterProps & ComponentProps<T>>;
  /** @deprecated */
  adapterProps?: ComponentProps<T>; // Will be passed to adapter alongside injected formagus props
};
