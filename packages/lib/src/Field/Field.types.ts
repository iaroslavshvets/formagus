import {type ReactNode} from 'react';
import {type FormController} from '../createFormController/createFormController.types';
import {type FormControllerClass} from '../FormControllerClass/FormControllerClass';

export type OnValidateFunction<T = any> =
  | ((value: T, values?: any) => any)
  | ((value: T, values?: any) => Promise<any>);

export type FieldState = Readonly<{
  initialValue: any;
  isDirty: boolean;
  isTouched: boolean;
  isChanged: boolean;
  isActive: boolean;
  isValidating: boolean;
  isMounted: boolean;
}>;

export type FormagusField<T = any> = Readonly<{
  name: string;
  fieldState: FieldState;
  value: any;
  errors: any;
  onChange: (value: any) => void;
  onFocus: () => void;
  onBlur: () => void;
  validate: () => Promise<any>;
  validateField: () => Promise<any>;
  fieldProps: FieldProps<T>;
}>;

export type FieldRenderProps<T = any> = {
  field: FormagusField<T>;
};

export type OnFormatFunction<T = any> = (value: T) => any;
export type OnEqualityCheckFunction<T = any> = (newValue: T, oldValue: T) => boolean;

export type FieldCommonProps<T = any> = {
  name: string;
  defaultValue?: T;
  onValidate?: OnValidateFunction<T>;
  onFormat?: OnFormatFunction<T>;
  onEqualityCheck?: OnEqualityCheckFunction<T>;
  onInit?: (API: FormagusField) => void;
  persist?: boolean;
  controller?: FormControllerClass;
};

export type FieldProps<T = any> = Omit<FieldCommonProps<T>, 'controller'> & {
  controller?: FormController;
  children?: ReactNode;
  render?: (injectedFieldDisplayProps: FieldRenderProps<T>) => ReactNode;
};
