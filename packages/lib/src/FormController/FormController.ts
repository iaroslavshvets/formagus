import * as React from 'react';
import {action, computed, observable, runInAction, toJS} from 'mobx';
import {EqualityCheckFunction, Field, FieldProps, FormatterFunction, ValidationFunction} from '../Field';

const set = require('lodash/set');
const get = require('lodash/get');
const merge = require('lodash/merge');
const cloneDeep = require('lodash/cloneDeep');

export type FieldDictionary<T> = {[fieldName: string]: T};

export type FormValidationErrors = FieldDictionary<Invalid> | null;

export type FormValues = {
  [key: string]: any | FormValues;
};

export type Valid = null | undefined;
export type Invalid = any;
export type FieldValidationState = Valid | Invalid;

export interface FormControllerOptions {
  initialValues?: FormValues;
  onValidate?: (values: any) => Promise<FieldDictionary<Invalid> | {}>;
  onFormat?: <T = Function>(values: FormValues) => {[P in keyof FormValues]: T[FormValues[P]]};
  onSubmit?: (errors: FormValidationErrors, values: FormValues, submitEvent?: React.FormEvent<any>) => void;
  onSubmitAfter?: (errors: FormValidationErrors, values: FormValues, submitEvent?: React.FormEvent<any>) => void;
}

export interface FormField {
  instance: null | Field;
  errors: FieldValidationState;
  meta: FormFieldMeta;
  props: undefined | FieldProps;
  value: any;
}

export interface FormFieldMeta {
  customState: {[key: string]: any};
  onEqualityCheck: EqualityCheckFunction;
  initialValue: any;
  isTouched: boolean;
  isActive: boolean;
  isValidating: boolean;
  isDirty: boolean;
  isRegistered: boolean;
}

export interface FormMeta {
  isValidating: boolean;
  isSubmitting: boolean;
  submitCount: number;
  isValid: boolean;
  isDirty: boolean;
  isTouched: boolean;
}

export interface SubmitResult {
  errors: FormValidationErrors;
  values: FormValues;
}

export interface FormAPI {
  values: FormValues;
  errors: FormValidationErrors;
  submit: (submitEvent?: React.FormEvent<any>) => Promise<SubmitResult>;
  reset: (values?: FormValues) => void;
  clear: () => void;
  setFieldValue: (fieldName: string, value: any) => void;
  setFieldCustomState: (fieldName: string, key: string, value: any) => void;
  validate: () => void;
  getFieldMeta: (fieldName: string) => FormFieldMeta;
  meta: FormMeta;
}

export class FormController {
  //Form options passed through form Props or directly through new Controller(options)
  protected options!: FormControllerOptions;

  @action
  protected setInitialValuesToCurrentValues = () => {
    this.options.initialValues = this.values;
    this.fields.forEach((field: FormField) => {
      field.meta.initialValue = get(this.options.initialValues, field.props!.name);
    });
  };

  //get all field level validations
  @computed
  protected get fieldFormatters() {
    const fieldFormatters: FieldDictionary<FormatterFunction> = {};
    this.fields.forEach((field: FormField, name: string) => {
      if (field.instance && field.props!.onFormat) {
        fieldFormatters[name] = field.props!.onFormat as FormatterFunction;
      }
    });

    return fieldFormatters;
  }

  //get all field level validations
  @computed
  protected get fieldValidations() {
    const fieldValidations: FieldDictionary<ValidationFunction> = {};

    this.fields.forEach((field: FormField, name: string) => {
      if (field.instance && field.props!.onValidate) {
        fieldValidations[name] = field.props!.onValidate as ValidationFunction;
      }
    });

    return fieldValidations;
  }

  //get all field values
  @computed
  protected get values() {
    const values = {};

    this.fields.forEach((field: FormField, name: string) => {
      if (field.instance) {
        set(
          values,
          name,
          toJS(field.value, {
            detectCycles: false,
          }),
        );
      }
    });

    return values;
  }

  //used for passing safe copy of values to users form child render function
  @computed
  protected get formattedValues() {
    const {onFormat} = this.options;
    const values = cloneDeep(this.values);

    Object.keys(this.fieldFormatters).forEach((fieldName) => {
      set(values, fieldName, this.fieldFormatters[fieldName](get(this.values, fieldName)));
    });

    return onFormat ? onFormat(values) : values;
  }

  //executes general form validator passed to Form as a `onValidate` prop and returns errors
  protected runFormLevelValidations = (): Promise<FieldDictionary<Invalid> | {}> => {
    return this.options.onValidate ? this.options.onValidate(this.formattedValues) : Promise.resolve({});
  };

  //executes all field level validators passed to Fields as a `onValidate` prop and returns errors
  protected runFieldLevelValidations = (): Promise<FieldDictionary<FieldValidationState> | {}> => {
    let pendingValidationCount = Object.keys(this.fieldValidations).length;

    if (pendingValidationCount === 0) {
      return Promise.resolve({});
    }

    return new Promise((resolve) => {
      const errors: {[index: string]: FieldValidationState} = {};

      Object.keys(this.fieldValidations).forEach((fieldName) => {
        const fieldMeta = this.fields.get(fieldName)!.meta;

        runInAction(() => (fieldMeta.isValidating = true));

        Promise.resolve(this.validateField(fieldName))
          .then(
            (error: FieldValidationState) => {
              if (!(error === null || error === undefined)) {
                errors[fieldName] = error;
              }
            },
            (error) => {
              errors[fieldName] = error;
            },
          )
          .then(() => {
            runInAction(() => (fieldMeta.isValidating = false));

            pendingValidationCount--;

            if (pendingValidationCount === 0) {
              resolve(errors);
            }
          });
      });
    });
  };

  @action
  protected setErrors = (errors: FormValidationErrors) => {
    this.errors = errors && Object.keys(errors).length ? errors : null;
  };
  //All onValidate errors
  @observable
  protected errors: FormValidationErrors = null;

  //validates particular field by calling field level validator passed to Field as a `validate` prop
  protected validateField = async (name: string): Promise<FieldValidationState> => {
    return await this.fieldValidations[name](get(this.values, name), this.values);
  };

  @action
  protected addVirtualField = (name: string) => {
    const self = this;

    const meta: FormFieldMeta = {
      onEqualityCheck: (a: any, b: any) => a === b,
      customState: observable.map(),
      initialValue: undefined,
      isTouched: false,
      isActive: false,
      isValidating: false,
      isRegistered: false,
      get isDirty() {
        const field = self.fields.get(name)!;
        return !field.meta.onEqualityCheck(field.value, field.meta.initialValue);
      },
    };

    this.fields.set(name, {
      instance: null,
      errors: null,
      value: undefined,
      props: undefined,
      meta,
    });
  };

  //used for first time field creation
  @action
  protected initializeVirtualField = (fieldInstance: Field, props: FieldProps) => {
    const {name, onEqualityCheck} = props;
    const field = this.fields.get(name);

    const initialValue =
      get(this.options.initialValues, name) !== undefined ? get(this.options.initialValues, name) : props.defaultValue;

    merge(field, {
      instance: fieldInstance,
      props,
      value: initialValue,
      meta: {
        onEqualityCheck,
        initialValue,
        isRegistered: true,
      },
    });
  };

  //used for cases when field was created, unmounted and created again
  @action
  protected initializeAlreadyExistedField = (fieldInstance: Field, props: FieldProps) => {
    const field = this.fields.get(props.name)!;

    field.instance = fieldInstance;
  };

  //general handler for registering the field upon it's mounting
  registerField = (fieldInstance: Field, props: FieldProps) => {
    const {name} = props;
    if (this.fields.has(name) && this.fields.get(name)!.meta.isRegistered) {
      this.initializeAlreadyExistedField(fieldInstance, props);
    } else {
      this.addVirtualField(name);
      this.initializeVirtualField(fieldInstance, props);
    }
  };

  @action
  protected updateErrorsForEveryField = (formValidationErrors: FormValidationErrors) => {
    this.fields.forEach((field) => {
      if (field.instance) {
        const errors: FieldValidationState = formValidationErrors && formValidationErrors[field.props!.name];

        field.errors = errors ? errors : null;
      }
    });
  };

  protected getFieldMeta = (fieldName: string) => {
    this.createFieldIfDoesNotExist(fieldName);
    return toJS(this.fields.get(fieldName)!.meta);
  };

  constructor(options: FormControllerOptions) {
    runInAction(() => (this.options = options));
  }

  //form FormAPI, which will be passed to child render function or could be retrieved with API prop from controller
  @computed
  get API(): FormAPI {
    return {
      values: this.formattedValues,
      errors: this.errors,
      submit: this.submit,
      reset: this.reset,
      clear: this.clear,
      setFieldValue: this.setFieldValue,
      setFieldCustomState: this.setFieldCustomState,
      validate: this.validate,
      getFieldMeta: this.getFieldMeta,
      meta: {
        isValidating: this.isValidating,
        isSubmitting: this.isSubmitting,
        submitCount: this.submitCount,
        isValid: this.isValid,
        isDirty: this.isDirty,
        isTouched: this.isTouched,
      },
    };
  }

  //where any of the form fields ever under user focus
  @computed
  get isTouched(): boolean {
    const fieldValues = Array.from(this.fields.values());
    return fieldValues.some((field: FormField) => field.instance !== null && field.meta.isTouched);
  }

  //are any of the fields have value different from initial
  @computed
  get isDirty(): boolean {
    const fieldValues = Array.from(this.fields.values());
    return fieldValues.some((field: FormField) => field.instance !== null && field.meta.isDirty);
  }

  //all registered form fields, new field is being added when Field constructor is called
  fields: Map<string, FormField> = observable.map();

  //changed when form onValidate state changes
  @computed
  get isValid(): boolean {
    return this.errors === null;
  }

  //changed when form starts or finishes validating
  @observable
  isValidating: boolean = false;
  @action
  setIsValidating = (state: boolean) => (this.isValidating = state);

  //changed when form starts or finishes submit process
  @observable
  isSubmitting: boolean = false;
  @action
  setIsSubmitting = (state: boolean) => (this.isSubmitting = state);

  //increments upon every submit try
  @observable
  submitCount: number = 0;
  @action
  setSubmitCount = (state: number) => (this.submitCount = state);

  //general handler for resetting form to specific state
  @action
  protected resetToValues = (values: FormValues) => {
    this.fields.forEach((field: FormField, name: string) => {
      field.value = get(values, name);
      field.meta.isTouched = false;
    });
    this.setSubmitCount(0);
    this.updateErrorsForEveryField({});
  };
  //resets the form to initial values and making it pristine
  reset = (values = this.options.initialValues) => {
    return values && this.resetToValues(values);
  };

  clear = () => {
    return this.resetToValues({});
  };

  //is called when field is unmounted
  @action
  unRegisterField = (fieldName: string) => {
    const field = this.fields.get(fieldName)!;
    if (field.props!.persist) {
      field.instance = null;
    } else {
      this.fields.delete(fieldName);
    }
  };

  //changes field active state usually based on 'blur'/'focus' events
  @action
  changeFieldActiveState = (fieldName: string, isActive: boolean) => {
    const field = this.fields.get(fieldName)!;
    if (isActive) {
      field.meta.isTouched = true;
    }
    field.meta.isActive = isActive;
  };

  //changes field custom state set by user
  @action
  setFieldCustomState = (fieldName: string, key: string, value: any) => {
    this.createFieldIfDoesNotExist(fieldName);
    this.fields.get(fieldName)!.meta.customState.set(key, value);
  };

  //changes when called adapted onChange handler
  @action
  setFieldValue = (fieldName: string, value: any) => {
    this.createFieldIfDoesNotExist(fieldName);
    const field = this.fields.get(fieldName)!;
    field.value = value;
  };

  protected createFieldIfDoesNotExist = (fieldName: string) => {
    if (!this.fields.has(fieldName)) {
      this.addVirtualField(fieldName);
    }
  };

  //validates the form by calling form level onValidate function combined with field level validations
  validate = async () => {
    this.setIsValidating(true);

    const [fieldValidationErrors, formValidationErrors] = await Promise.all([
      this.runFieldLevelValidations(),
      this.runFormLevelValidations(),
    ]);

    this.setErrors(merge(fieldValidationErrors, formValidationErrors));

    this.updateErrorsForEveryField(this.errors);

    this.setIsValidating(false);
  };

  //wraps submit function passed as a form `onSubmit` prop and it's being passed to child render function
  submit = async <E>(submitEvent?: React.FormEvent<E>) => {
    if (submitEvent) {
      submitEvent.persist();
      submitEvent.preventDefault();
    }

    this.setSubmitCount(this.submitCount + 1);
    this.setIsSubmitting(true);

    await this.validate();

    const errors = toJS(this.errors);
    const values = toJS(this.formattedValues);

    try {
      if (this.options.onSubmit) {
        await this.options.onSubmit(errors, values, submitEvent);
      }

      if (this.errors === null) {
        this.setInitialValuesToCurrentValues();
      }
    } catch {
    } finally {
      this.setIsSubmitting(false);
    }

    if (this.options.onSubmitAfter) {
      this.options.onSubmitAfter(errors, values, submitEvent);
    }

    return {errors, values};
  };
}
