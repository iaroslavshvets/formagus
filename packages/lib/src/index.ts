import {FormAPI} from './FormControllerClass/FormControllerClass.types';
export type {
  OnValidateFunction,
  OnEqualityCheckFunction,
  FieldMeta,
  FieldProps,
  FieldRenderProps,
} from './Field/Field.types';
export type {FormProps} from './Form/Form.types';
export type {FormAPI, FormField} from './FormControllerClass/FormControllerClass.types';
export type {FormController} from './createFormController/createFormController.types';

/** inner implementation, use createFormController to create controllers, unless you want to extend from base class */
export {FormControllerClass} from './FormControllerClass/FormControllerClass';

export {createFormController} from './createFormController/createFormController';

export {Field} from './Field/Field';
export {useField} from './useField';

export {Form} from './Form/Form';
export {useForm} from './useForm';

// deprecated, but still may be used with React class components
export {injectFormApi} from './injectFormApi';
export type InjectedFormAPI = {
  formApi: FormAPI;
};