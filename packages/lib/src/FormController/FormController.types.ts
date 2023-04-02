import type {FormEvent} from 'react';
import type {EqualityCheckFunction, FieldProps, FormagusProps} from '../Field';

export type FieldDictionary<T> = Record<string, T>;

export type FormValidationErrors = FieldDictionary<Invalid> | null;

export type FormValues = any;

export type Valid = null | undefined;
export type Invalid = any;
export type FieldValidationState = Valid | Invalid;

export interface FormControllerOptions {
  initialValues?: FormValues;
  onValidate?: (values: any) => Promise<FieldDictionary<Invalid> | undefined>;
  onFormat?: (values: FormValues) => FormValues;
  onSubmit?: (errors: FormValidationErrors, values: FormValues, submitEvent?: FormEvent<any>) => void;
}

export interface FormField {
  errors: FieldValidationState;
  meta: FormFieldMeta;
  props: undefined | FieldProps;
  value: any;
  handlers: Pick<FormagusProps, 'onChange' | 'setCustomState' | 'onFocus' | 'onBlur' | 'validate' | 'validateField'>;
}

export interface FormFieldMeta {
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
  getFieldMeta: (fieldName: string) => FormFieldMeta;
  meta: FormMeta;
}
