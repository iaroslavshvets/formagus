import type {FormEvent} from 'react';
import {ObservableMap} from 'mobx';
import type {EqualityCheckFunction, FieldProps, FormagusProps} from '../Field/Field.types';

export interface FormControllerOptions {
  initialValues?: any;
  onValidate?: (values: any) => Promise<any>;
  onFormat?: (values: any) => any;
  onSubmit?: (errors: any, values: any, submitEvent?: FormEvent<HTMLElement>) => void;
  fieldValueToFormValuesConverter?: {
    set: (values: any, fieldName: string, value: any) => any;
    get: (values: any, fieldName: string) => any;
  };
}

export interface FormField {
  errors: any;
  meta: FieldMeta;
  props?: FieldProps;
  value: any;
  handlers: Pick<FormagusProps, 'onChange' | 'setCustomState' | 'onFocus' | 'onBlur' | 'validate' | 'validateField'>;
}

export interface FieldMeta {
  customState: Record<string, any>;
  onEqualityCheck: EqualityCheckFunction;
  initialValue: any;
  isTouched: boolean;
  isChanged: boolean;
  isActive: boolean;
  isValidating: boolean;
  isDirty: boolean;
  isMounted: boolean;
  isRegistered: boolean;
}

export interface FormMeta {
  isValidating: boolean;
  isSubmitting: boolean;
  submitCount: number;
  isValid: boolean;
  isDirty: boolean;
  isTouched: boolean;
  isChanged: boolean;
}

export interface FormAPI {
  values: any;
  errors: any;
  submit: <T = any, K = any>(
    submitEvent?: FormEvent<any>,
  ) => Promise<{
    errors: T;
    values: K;
  }>;
  reset: () => void;
  resetToValues: (values: any) => void;
  clear: () => void;
  setFieldValue: (fieldName: string, value: any) => void;
  /** @deprecated don't use */
  setFieldCustomState: (fieldName: string, key: string, value: any) => void;
  validate: () => void;
  getFieldMeta: (fieldName: string) => FieldMeta;
  meta: FormMeta;
  rawFields: ObservableMap<string, FormField>;
}
