import type {OnValidateFunction} from './Field/Field.types';

export type {
  OnValidateFunction,
  FieldMeta,
  EqualityCheckFunction,
  FieldProps,
  FieldRenderProps,
} from './Field/Field.types';
export type {FormProps} from './Form/Form.types';
export type {
  FormAPI,
  // don't export in next version: begin
  FormValidationErrors,
  FormValues,
  FieldErrors,
  // don't export in next version: end
  FormField,
} from './FormControllerClass/FormControllerClass.types';
export type {FormController} from './createFormController/createFormController.types';

/** inner implementation, use createFormController to create controllers, unless you want to extend from base class */
export {FormControllerClass} from './FormControllerClass/FormControllerClass';

export {createFormController} from './createFormController/createFormController';

export {Field} from './Field/Field';
export {useField} from './Field/useField';

export {Form} from './Form/Form';
export {useForm} from './Form/useForm';

// don't export in next version
export {FormPart} from './FormPart';

// deprecated
export type {AdapterProps} from './Field/Field.types';
export {injectFormApi} from './injectFormApi';
export {useFormApi} from './useFormApi';
export {utils} from './utils/utils';
export type ValidationFunction = OnValidateFunction;
