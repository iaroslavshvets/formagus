import React from 'react';
import type {FieldValidationState, FormMeta} from '../FormController';

export type ValidationFunction =
  | ((value: any, values?: any) => FieldValidationState)
  | ((value: any, values?: any) => Promise<FieldValidationState>);

export type FieldAdapter = ((adapterProps: AdapterProps) => JSX.Element) | React.ComponentClass<any> | React.SFC<any>;

export interface FieldMeta {
  errors: any | null;
  isDirty: boolean;
  isTouched: boolean;
  isActive: boolean;
  isValidating: boolean;
  isRegistered: boolean;
  customState: {[key: string]: any};
  form: FormMeta;
}

export interface AdapterProps {
  formagus?: {
    name: string;
    meta: FieldMeta;
    value: any;
    setCustomState: (key: string, value: any) => void;
    onChange: (value: any) => void;
    onFocus: () => void;
    onBlur: () => void;
    validate: () => void;
  };
}

export type FormatterFunction = (value: any) => any;
export type EqualityCheckFunction = (newValue: any, oldValue: any) => boolean;

export type FieldProps = {
  name: string;
  children?: (injectedAdapterProps: AdapterProps) => JSX.Element;
  adapter?: FieldAdapter;
  defaultValue?: any;
  onValidate?: ValidationFunction;
  onFormat?: FormatterFunction;
  onEqualityCheck?: EqualityCheckFunction;
  onInit?: Function;
  persist?: boolean;
  adapterProps?: any;
};
