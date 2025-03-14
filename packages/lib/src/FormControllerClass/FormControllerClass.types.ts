import {type FormEvent} from 'react';
import {type OnEqualityCheckFunction, type FieldProps, type FieldFormagus} from '../Field/Field.types';

export type Values = Record<string, any>;
export type Errors = Record<string, any>;

export type SubmitParams<T extends HTMLElement = HTMLElement> = {
  values: Values;
  errors: Errors;
  isValid: boolean;
  event?: FormEvent<T>;
};

export type FormControllerOptions = {
  initialValues?: any;
  onValidate?: (values: Values) => Promise<any>;
  onFormat?: (values: Values) => Values;
  onSubmit?: (params: SubmitParams) => any;
};

export type FormField = {
  meta: FieldMeta;
  fieldProps?: FieldProps;
  value: any;
  errors: any;
} & Pick<FieldFormagus, 'onChange' | 'onFocus' | 'onBlur' | 'validate' | 'validateField'>;

export type FieldMeta = {
  onEqualityCheck: OnEqualityCheckFunction;
  initialValue: any;
  isTouched: boolean;
  isChanged: boolean;
  isActive: boolean;
  isValidating: boolean;
  isDirty: boolean;
  isMounted: boolean;
  isRegistered: boolean;
};

export type FormMeta = {
  isValidating: boolean;
  isSubmitting: boolean;
  submitCount: number;
  isValid: boolean;
  isDirty: boolean;
  isTouched: boolean;
  isChanged: boolean;
};

export type FormAPI = {
  // form
  values: Values;
  errors: Errors;
  meta: FormMeta;
  submit: <T extends HTMLElement>(
    submitEvent?: FormEvent<T>,
  ) => Promise<
    Omit<SubmitParams<T>, 'event'> & {
      submitResult:
        | {
            isValid: true;
            response: any;
          }
        | {
            isValid: false;
            error: Error;
          };
    }
  >;
  reset: (values?: Values) => void;
  validate: () => any;
  resetToValues: (values: Values) => void;
  // fields
  hasField: (fieldName: string) => boolean;
  getField: (fieldName: string) => FormField | undefined;
  validateField: (fieldName: string) => any;
  setFieldValue: (fieldName: string, value: any) => void;
  getFields: () => Record<string, FormField>;
};
