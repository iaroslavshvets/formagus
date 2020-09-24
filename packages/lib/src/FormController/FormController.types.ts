import {FormEvent} from 'react';
import type {EqualityCheckFunction, FieldClass, FieldProps} from '../Field';

export type FieldDictionary<T> = {[fieldName: string]: T};

export type FormValidationErrors = FieldDictionary<Invalid> | null;

export type FormValues = {
  [key: string]: any | FormValues;
};

export type Valid = null | undefined;
export type Invalid = any;
export type FieldValidationState = Valid | Invalid;

export interface FormControllerOptions {
  initialValues?: FormValues;
  onValidate?: (values: any) => Promise<FieldDictionary<Invalid> | {}>;
  onFormat?: (values: FormValues) => FormValues;
  onSubmit?: (errors: FormValidationErrors, values: FormValues, submitEvent?: FormEvent<any>) => void;
  onSubmitAfter?: (errors: FormValidationErrors, values: FormValues, submitEvent?: FormEvent<any>) => void;
}

export interface FormField {
  instance: null | FieldClass;
  errors: FieldValidationState;
  meta: FormFieldMeta;
  props: undefined | FieldProps;
  value: any;
}

export interface FormFieldMeta {
  customState: {[key: string]: any};
  onEqualityCheck: EqualityCheckFunction;
  initialValue: any;
  isTouched: boolean;
  isActive: boolean;
  isValidating: boolean;
  isDirty: boolean;
  isRegistered: boolean;
}

export interface FormMeta {
  isValidating: boolean;
  isSubmitting: boolean;
  submitCount: number;
  isValid: boolean;
  isDirty: boolean;
  isTouched: boolean;
}

export interface SubmitResult {
  errors: FormValidationErrors;
  values: FormValues;
}

export interface FormAPI {
  values: FormValues;
  errors: FormValidationErrors;
  submit: (submitEvent?: React.FormEvent<any>) => Promise<SubmitResult>;
  reset: () => void;
  resetToValues: (values: FormValues) => void;
  clear: () => void;
  setFieldValue: (fieldName: string, value: any) => void;
  setFieldCustomState: (fieldName: string, key: string, value: any) => void;
  validate: () => void;
  getFieldMeta: (fieldName: string) => FormFieldMeta;
  meta: FormMeta;
}
