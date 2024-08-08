import {type ComponentClass, type FC, type ReactNode} from 'react';
import {type ComponentProps, type JSXElementConstructor} from 'react';
import {type FormController} from '../createFormController/createFormController.types';
import {type FormControllerClass} from '../FormControllerClass/FormControllerClass';

export type OnValidateFunction<T extends any = any> =
  | ((value: T, values?: any) => any)
  | ((value: T, values?: any) => Promise<any>);

export type FieldMeta = Readonly<{
  initialValue: any;
  isDirty: boolean;
  isTouched: boolean;
  isChanged: boolean;
  isActive: boolean;
  isValidating: boolean;
  isMounted: boolean;
  /** @deprecated */
  customState: Record<string, any>;
}>;

export type FieldFormagus = Readonly<{
  name: string;
  meta: FieldMeta;
  value: any;
  errors: any;
  /** @deprecated */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setCustomState: (key: string, value: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onChange: (value: any) => void;
  onFocus: () => void;
  onBlur: () => void;
  validate: () => Promise<any>;
  validateField: () => Promise<any>;
  fieldProps: FieldProps;
}>;

export interface FieldRenderProps {
  formagus: FieldFormagus;
}

export type OnFormatFunction<T = any> = (value: T) => any;
export type OnEqualityCheckFunction<T = any> = (newValue: T, oldValue: T) => boolean;

export interface FieldCommonProps<T = any> {
  name: string;
  defaultValue?: T;
  onValidate?: OnValidateFunction<T>;
  onFormat?: OnFormatFunction<T>;
  onEqualityCheck?: OnEqualityCheckFunction<T>;
  onInit?: (API: FieldFormagus) => void;
  persist?: boolean;
  controller?: FormControllerClass;
}

// eslint-disable-next-line  @typescript-eslint/no-unused-vars
export type FieldProps<T extends JSXElementConstructor<any> = any> = Omit<FieldCommonProps, 'controller'> & {
  controller?: FormController;
  children?: ReactNode;
  render?: (injectedFieldDisplayProps: FieldRenderProps) => ReactNode;
  /** @deprecated Pass children and useField hook inside instead, or at least render prop. */
  adapter?:
    | ComponentClass<Partial<FieldRenderProps> & ComponentProps<T>>
    | FC<Partial<FieldRenderProps> & ComponentProps<T>>;
  /** @deprecated */
  adapterProps?: ComponentProps<T>; // Will be passed to adapter alongside injected formagus props
};
