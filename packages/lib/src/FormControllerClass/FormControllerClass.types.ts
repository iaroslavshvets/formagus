import {type FormEvent} from 'react';
import {type OnEqualityCheckFunction, type FieldProps, type FieldApi} from '../Field/Field.types';

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
  fieldState: FieldState;
  fieldProps?: FieldProps;
  value: any;
  errors: any;
} & Pick<FieldApi, 'onChange' | 'onFocus' | 'onBlur' | 'validate' | 'validateField'>;

export type FieldState = {
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

export type FormState = {
  isValidating: boolean;
  isSubmitting: boolean;
  submitCount: number;
  isValid: boolean;
  isDirty: boolean;
  isTouched: boolean;
  isChanged: boolean;
};

export type FormApi = {
  // form
  values: Values;
  errors: Errors;
  formState: FormState;
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
  // fields
  hasField: (fieldName: string) => boolean;
  getField: (fieldName: string) => FormField | undefined;
  validateField: (fieldName: string) => any;
  setFieldValue: (fieldName: string, value: any) => void;
  getFields: () => Record<string, FormField>;
};
