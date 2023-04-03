import type {FormEvent} from 'react';
import type {EqualityCheckFunction, FieldProps, FormagusProps} from '../Field';

export type FieldName = string;
export type FormValues = any;
export type FieldDictionary<T = unknown> = Record<FieldName, T>;
export type FormValidationErrors = FieldDictionary | null | undefined;
export type FieldErrors = any;

export interface FormControllerOptions {
  initialValues?: FormValues;
  onValidate?: (values: any) => Promise<any>;
  onFormat?: (values: FormValues) => FormValues;
  onSubmit?: (errors: FormValidationErrors, values: FormValues, submitEvent?: FormEvent<any>) => void;
}

export interface FormField {
  errors: FieldErrors;
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

export interface SubmitResult {
  errors: FormValidationErrors;
  values: FormValues;
}

export interface FormAPI {
  values: FormValues;
  errors: FormValidationErrors;
  submit: (submitEvent?: FormEvent<any>) => Promise<SubmitResult>;
  reset: () => void;
  resetToValues: (values: FormValues) => void;
  clear: () => void;
  setFieldValue: (fieldName: string, value: any) => void;
  setFieldCustomState: (fieldName: string, key: string, value: any) => void;
  validate: () => void;
  getFieldMeta: (fieldName: string) => FieldMeta;
  meta: FormMeta;
}
