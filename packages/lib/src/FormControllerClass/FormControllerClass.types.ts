import {type FormEvent} from 'react';
import {type OnEqualityCheckFunction, type FieldProps, type FieldFormagus} from '../Field/Field.types';

export type Values = Record<string, any>;
export type Errors = Record<string, any>;

export interface SubmitParams<T extends HTMLElement = HTMLElement> {
  values: Values;
  errors: Errors;
  /** @deprecated Don't use, use isValid instead. */
  isSuccess: boolean;
  isValid: boolean;
  event?: FormEvent<T>;
}

export type FormagusEvent =
  | {
      type: 'submit:begin';
    }
  | ({
      type: 'submit:end';
    } & Omit<SubmitParams, 'event'>)
  | {
      type: 'validate:begin';
    }
  | {
      type: 'validate:end';
      errors: Errors;
    }
  | {
      type: 'validateField:begin';
      name: string;
    }
  | {
      type: 'validateField:end';
      name: string;
      errors: Errors;
    };

export interface FormControllerOptions {
  initialValues?: any;
  onValidate?: (values: Values) => Promise<any>;
  onFormat?: (values: Values) => any;
  onSubmit?: (params: SubmitParams) => void;
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
  // form
  values: Values;
  rawValues: Values;
  errors: Errors;
  meta: FormMeta;
  submit: <T extends HTMLElement>(
    submitEvent?: FormEvent<T>,
  ) => Promise<
    Omit<SubmitParams<T>, 'event'> & {
      submitResult:
        | {
            isSuccess: true;
            response: any;
          }
        | {
            isSuccess: false;
            error: Error;
          };
    }
  >;
  reset: () => void;
  clear: () => void;
  validate: () => any;
  resetToValues: (values: Values) => void;
  // fields
  hasField: (fieldName: string) => boolean;
  getField: (fieldName: string) => FormField | undefined;
  validateField: (fieldName: string) => any;
  setFieldValue: (fieldName: string, value: any) => void;
  getFields: () => Record<string, FormField>;
  /** @deprecated don't use */
  setFieldCustomState: (fieldName: string, key: string, value: any) => void;
}
