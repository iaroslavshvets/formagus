import React from 'react';
import ReactDOM from 'react-dom';
import {action, computed, observable} from 'mobx';
import {observerBatching} from 'mobx-react';
import merge from 'lodash/merge';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import {utils} from './utils';
import {toJSCompat} from '../utils/toJSCompat';
import {makeObservableForMobx6} from '../utils/makeObservableForMobx6';
import type {FieldProps, FormatterFunction, ValidationFunction} from '../Field';
import type {
  FieldDictionary,
  FieldValidationState,
  FormAPI,
  FormControllerOptions,
  FormField,
  FormValidationErrors,
  FormValues,
  Invalid,
} from './FormController.types';

export class FormController {
  // Form options passed through form Props or directly through new Controller(options)
  protected options!: FormControllerOptions;

  // get all field level validations
  @computed
  protected get fieldFormatters() {
    const fieldFormatters: FieldDictionary<FormatterFunction> = {};
    this.fields.forEach((field, name) => {
      if (field.meta.isMounted && field.props!.onFormat) {
        fieldFormatters[name] = field.props!.onFormat as FormatterFunction;
      }
    });

    return fieldFormatters;
  }

  // get all field level validations
  @computed
  protected get fieldValidations() {
    const fieldValidations: FieldDictionary<ValidationFunction> = {};

    this.fields.forEach((field, name) => {
      if (field.meta.isMounted && field.props!.onValidate) {
        fieldValidations[name] = field.props!.onValidate as ValidationFunction;
      }
    });

    return fieldValidations;
  }

  // get all field values
  @observable values: any = {};

  @action setValues = (fieldName: string, value: any) => {
    const safeValue = toJSCompat(value, false);
    utils.setValue(this.values, fieldName, safeValue);
    this.updateFormattedValues(fieldName, safeValue);
  };

  // used for passing safe copy of values to users form child render function
  @action private updateFormattedValues = (fieldName: string, value: any) => {
    const baseValues = cloneDeep(this.values);
    const {onFormat} = this.options;
    const fieldFormatter = this.fieldFormatters[fieldName];
    utils.setValue(baseValues, fieldName, fieldFormatter ? fieldFormatter(value) : value);
    this.API.values = onFormat ? onFormat(baseValues) : baseValues;
  };

  @action protected setInitialValuesToCurrentValues = (values: FormValues = this.values) => {
    this.options.initialValues = values;

    this.fields.forEach((field, name) => {
      if (field.meta.isMounted) {
        field.meta.initialValue = utils.getValue(this.options.initialValues, name);
      }
    });
  };

  // executes general form validator passed to Form as a `onValidate` prop and returns errors
  protected runFormLevelValidations = (): Promise<FieldDictionary<Invalid> | Record<string, never>> => {
    return this.options.onValidate ? this.options.onValidate(this.API.values) : Promise.resolve({});
  };

  // executes all field level validators passed to Fields as a `onValidate` prop and returns errors
  protected runFieldLevelValidations = async (): Promise<FieldDictionary<FieldValidationState> | {}> => {
    let pendingValidationCount = Object.keys(this.fieldValidations).length;

    if (pendingValidationCount === 0) {
      return {};
    }

    return new Promise((resolve) => {
      const errors: Record<string, FieldValidationState> = {};

      // use forEach instead of async/await to run validations in parallel
      Object.keys(this.fieldValidations).forEach((fieldName) => {
        const field = this.fields.get(fieldName)!;

        this.updateFieldMetaIsValidating(field, true);

        Promise.resolve(this.runFieldLevelValidation(fieldName))
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
            this.updateFieldMetaIsValidating(field, false);

            pendingValidationCount -= 1;

            if (pendingValidationCount === 0) {
              resolve(errors);
            }
          });
      });
    });
  };

  // all onValidate errors
  @action protected setFormValidationErrors = (errors: FormValidationErrors) => {
    this.API.errors = errors && Object.keys(errors).length ? errors : null;
    this.setIsValid(this.API.errors === null);
  };

  // all registered form fields, new field is being added when Field constructor is called
  fields = observable.map<string, FormField>();

  @action updateFieldMetaIsValidating = (field: FormField, state: boolean) => {
    field.meta.isValidating = state;
  };

  // runs validation for particular field
  protected runFieldLevelValidation = (name: string) => {
    return this.fieldValidations[name](utils.getValue(this.API.values, name), this.API.values);
  };

  @action protected addVirtualField = (name: string) => {
    const self = this;

    this.fields.set(name, {
      errors: null,
      value: undefined,
      props: undefined,
      handlers: {
        validateField: () => this.validateField(name),
        validate: () => this.validate(),
        onChange: (value: any) => this.setFieldValue(name, value),
        setCustomState: (key: string, value: any) => this.setFieldCustomState(name, key, value),
        onFocus: () => this.changeFieldActiveState(name, true),
        onBlur: () => this.changeFieldActiveState(name, false),
      },
      meta: {
        onEqualityCheck: (a: any, b: any) => a === b || (isEmpty(a) && isEmpty(b)),
        customState: {},
        initialValue: undefined,
        isTouched: false,
        isChanged: false,
        isActive: false,
        isValidating: false,
        isMounted: false,
        isRegistered: false,
        get isDirty() {
          const field = self.fields.get(name)!;
          return !field.meta.onEqualityCheck(field.value, field.meta.initialValue);
        },
      },
    });
  };

  // used for first time field creation
  @action protected initializeVirtualField = (props: FieldProps) => {
    const {name, onEqualityCheck, persist = false} = props;
    const field = this.fields.get(name);

    const initialValue =
      utils.getValue(this.options.initialValues, name) !== undefined
        ? utils.getValue(this.options.initialValues, name)
        : props.defaultValue;

    merge(field, {
      props: {
        persist,
        ...props,
      },
      value: initialValue,
      meta: {
        onEqualityCheck,
        initialValue,
      },
    });

    this.setValues(name, initialValue);
  };

  // used for cases when field was created, unmounted and created again
  @action protected initializeAlreadyExistedField = (props: FieldProps) => {
    const field = this.fields.get(props.name)!;
    field.props = props;
  };

  // called when field is mounted
  @action registerField = (props: FieldProps) => {
    const {name} = props;

    if (this.fields.get(name)?.meta.isRegistered) {
      this.initializeAlreadyExistedField(props);
    } else {
      this.addVirtualField(name);
      this.initializeVirtualField(props);
    }

    const field = this.fields.get(name)!;

    field.meta.isMounted = true;
    field.meta.isRegistered = true;

    this.setValues(name, field.value);
  };

  // called when field is unmounted
  @action unRegisterField = (name: string) => {
    const field = this.fields.get(name)!;
    if (field.props!.persist) {
      field.meta.isMounted = false;
    } else {
      this.fields.delete(name);
    }
    this.setValues(name, undefined);
  };

  protected updateFieldErrors = (field: FormField, errors: FieldValidationState = null) => {
    if (field.meta.isMounted) {
      field.errors = errors;
    }
  };

  @action protected updateErrorsForEveryField = (formValidationErrors: FormValidationErrors) => {
    this.fields.forEach((field, name) => {
      this.updateFieldErrors(field, formValidationErrors && formValidationErrors[name]);
    });
  };

  protected getFieldMeta = (fieldName: string) => {
    this.createFieldIfDoesNotExist(fieldName);
    return toJSCompat(this.fields.get(fieldName)!.meta);
  };

  constructor(options: FormControllerOptions) {
    observerBatching(ReactDOM.unstable_batchedUpdates);

    makeObservableForMobx6(this);

    this.options = options;
    this.createFormApi();
  }

  // form FormAPI, which will be passed to child render function or could be retrieved with API prop from controller
  @observable API: FormAPI = {} as any;

  @action createFormApi = () => {
    this.API = {
      values: {},
      errors: {},
      submit: this.submit,
      reset: this.reset,
      resetToValues: this.resetToValues,
      clear: this.clear,
      setFieldValue: this.setFieldValue,
      setFieldCustomState: this.setFieldCustomState,
      validate: this.validate,
      getFieldMeta: this.getFieldMeta,
      meta: {
        isValidating: false,
        isSubmitting: false,
        submitCount: 0,
        isValid: true,
        isDirty: this.isDirty,
        isTouched: this.isTouched,
        isChanged: this.isChanged,
      },
    };
  };

  // where any of the form fields ever under user focus
  @computed
  get isTouched(): boolean {
    const fields = Array.from(this.fields.values());
    return fields.some((field) => field.meta.isMounted && field.meta.isTouched);
  }

  // where any of the form fields ever changed
  @computed
  get isChanged(): boolean {
    const fields = Array.from(this.fields.values());
    return fields.some((field) => field.meta.isMounted && field.meta.isChanged);
  }

  // any of the fields have value different from the initial
  @computed
  get isDirty(): boolean {
    const fields = Array.from(this.fields.values());
    return fields.some((field) => field.meta.isMounted && field.meta.isDirty);
  }

  @action setIsTouched = (state: boolean) => {
    this.API.meta.isTouched = state;
  };

  @action setIsValid = (state: boolean) => {
    this.API.meta.isValid = state;
  };

  @action setIsValidating = (state: boolean) => {
    this.API.meta.isValidating = state;
  };

  @action setIsSubmitting = (state: boolean) => {
    this.API.meta.isSubmitting = state;
  };

  // increments upon every submit try
  @action setSubmitCount = (state: number) => {
    this.API.meta.submitCount = state;
  };

  // general handler for resetting form to specific state
  @action resetToValues = (values: FormValues) => {
    this.fields.forEach((field, name) => {
      const newValue = utils.getValue(values, name);
      const fieldName = field.props?.name!;
      field.value = newValue;
      field.meta.isTouched = false;
      field.meta.isChanged = false;
      this.setValues(fieldName, newValue);
    });
    this.setInitialValuesToCurrentValues(values);
    this.setSubmitCount(0);
    this.updateErrorsForEveryField({});
  };

  // resets the form to initial values
  reset = () => {
    return this.resetToValues(this.options.initialValues || {});
  };

  // resets the form to empty values
  clear = () => {
    return this.resetToValues({});
  };

  // changes field active state usually based on 'blur'/'focus' events called within the adapter
  @action changeFieldActiveState = (fieldName: string, isActive: boolean) => {
    const field = this.fields.get(fieldName)!;
    if (isActive) {
      field.meta.isTouched = true;
    }
    field.meta.isActive = isActive;
  };

  // changes field custom state, that was set by user
  @action setFieldCustomState = (fieldName: string, key: string, value: any) => {
    this.createFieldIfDoesNotExist(fieldName);
    this.fields.get(fieldName)!.meta.customState[key] = value;
  };

  // changes when adapted onChange handler is called
  @action setFieldValue = (fieldName: string, value: any) => {
    this.createFieldIfDoesNotExist(fieldName);
    const field = this.fields.get(fieldName)!;
    field.value = value;
    field.meta.isChanged = true;
    this.setValues(fieldName, value);
  };

  protected createFieldIfDoesNotExist = (fieldName: string) => {
    if (!this.fields.has(fieldName)) {
      this.addVirtualField(fieldName);
    }
  };

  // validates single field by calling field level validation, passed to Field as `validate` prop
  protected validateField = async (fieldName: string) => {
    if (!this.fieldValidations[fieldName]) {
      return;
    }

    this.setIsValidating(true);

    const field = this.fields.get(fieldName)!;

    this.updateFieldMetaIsValidating(field, true);

    const errors = await (async () => {
      try {
        const result = await this.runFieldLevelValidation(fieldName);
        if (result !== undefined && result !== null) {
          return result;
        }
        return;
      } catch (e) {
        return e;
      }
    })();

    this.updateFieldMetaIsValidating(field, false);
    this.setFormValidationErrors(merge(this.API.errors, {[fieldName]: errors}));
    this.updateFieldErrors(field, errors);

    this.setIsValidating(false);
  };

  // validates the form, by calling form level onValidate function combined with field level validations,
  // passed to Field as `validate` prop
  validate = async () => {
    this.setIsValidating(true);

    const [fieldValidationErrors, formValidationErrors] = await Promise.all([
      this.runFieldLevelValidations(),
      this.runFormLevelValidations(),
    ]);

    this.setFormValidationErrors(merge(fieldValidationErrors, formValidationErrors));

    this.updateErrorsForEveryField(this.API.errors);

    this.setIsValidating(false);
  };

  // wraps submit function passed as Form `onSubmit` prop after it's being passed to child render function
  @action submit = async <E>(submitEvent?: React.FormEvent<E>) => {
    if (submitEvent) {
      submitEvent.persist();
      submitEvent.preventDefault();
    }

    this.setSubmitCount(this.API.meta.submitCount + 1);
    this.setIsSubmitting(true);

    await this.validate();

    const errors = toJSCompat(this.API.errors);
    const values = toJSCompat(this.API.values);

    try {
      if (this.options.onSubmit) {
        await this.options.onSubmit(errors, values, submitEvent);
      }

      if (this.API.errors === null) {
        this.setInitialValuesToCurrentValues();
      }
    } finally {
      this.setIsSubmitting(false);
    }

    if (this.options.onSubmitAfter) {
      this.options.onSubmitAfter(errors, values, submitEvent);
    }

    return {errors, values};
  };
}
