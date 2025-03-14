import {type ReactNode} from 'react';
import {type FormController} from '../createFormController/createFormController.types';
import {type FormControllerClass} from '../FormControllerClass/FormControllerClass';

export type OnValidateFunction<T = unknown> =
  | ((value: T, values?: unknown) => unknown)
  | ((value: T, values?: unknown) => Promise<unknown>);

export type FieldMeta = Readonly<{
  initialValue: any;
  isDirty: boolean;
  isTouched: boolean;
  isChanged: boolean;
  isActive: boolean;
  isValidating: boolean;
  isMounted: boolean;
}>;

export type FieldFormagus<T = unknown> = Readonly<{
  name: string;
  meta: FieldMeta;
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
  formagus: FieldFormagus<T>;
};

export type OnFormatFunction<T = any> = (value: T) => any;
export type OnEqualityCheckFunction<T = any> = (newValue: T, oldValue: T) => boolean;

export type FieldCommonProps<T = any> = {
  name: string;
  defaultValue?: T;
  onValidate?: OnValidateFunction<T>;
  onFormat?: OnFormatFunction<T>;
  onEqualityCheck?: OnEqualityCheckFunction<T>;
  onInit?: (API: FieldFormagus) => void;
  persist?: boolean;
  controller?: FormControllerClass;
};

export type FieldProps<T = any> = Omit<FieldCommonProps<T>, 'controller'> & {
  controller?: FormController;
  children?: ReactNode;
  render?: (injectedFieldDisplayProps: FieldRenderProps<T>) => ReactNode;
};
