import type {FormEvent} from 'react';
import type {OnEqualityCheckFunction, FieldProps, FieldFormagus} from '../Field/Field.types';

export type Values = Record<string, any>;
export type Errors = Record<string, any>;
export interface FormControllerOptions {
  initialValues?: any;
  onValidate?: (values: Values) => Promise<any>;
  onFormat?: (values: Values) => any;
  onSubmit?: (params: {values: Values; errors: Errors; isSuccess: boolean; event?: FormEvent<HTMLElement>}) => void;
  fieldValueToFormValuesConverter?: {
    set: (values: Values, fieldName: string, value: any) => any;
    get: (values: Values, fieldName: string) => any;
  };
}

export interface FormField
  extends Pick<FieldFormagus, 'onChange' | 'setCustomState' | 'onFocus' | 'onBlur' | 'validate' | 'validateField'> {
  meta: FieldMeta;
  fieldProps?: FieldProps;
  value: any;
  errors: any;
}

export interface FieldMeta {
  customState: Record<string, any>;
  onEqualityCheck: OnEqualityCheckFunction;
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
  values: Values;
  errors: Errors;
  submit: (submitEvent?: FormEvent<any>) => Promise<{
    values: Values;
    errors: Errors;
  }>;
  meta: FormMeta;
  getField: (fieldName: string) => FormField | undefined;
  getFields: () => Record<string, FormField>;
  reset: () => void;
  clear: () => void;
  resetToValues: (values: Values) => void;
  setFieldValue: (fieldName: string, value: any) => void;
  /** @deprecated don't use */
  setFieldCustomState: (fieldName: string, key: string, value: any) => void;
  validate: () => any;
  validateField: (fieldName: string) => any;
  hasField: (fieldName: string) => boolean;
}
