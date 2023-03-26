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

  @action updateValues = (fieldName: string, value: any) => {
    const safeValue = toJSCompat(value, false);
    utils.setValue(this.values, fieldName, safeValue);
    this.updateFormattedValues(fieldName, safeValue);
  };

  @action setFieldMeta = (field: FormField, meta: Partial<FormField['meta']>) => {
    Object.assign(field.meta, meta);
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
        this.setFieldMeta(field, {
          initialValue: utils.getValue(this.options.initialValues, name)
        })
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

        this.setFieldMeta(field, {
          isValidating: true,
        })

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
            this.setFieldMeta(field, {
              isValidating: false,
            })

            pendingValidationCount -= 1;

            if (pendingValidationCount === 0) {
              resolve(errors);
            }
          });
      });
    });
  };

  // all registered form fields, new field is being added when Field constructor is called
  fields = observable.map<string, FormField>();

  // all onValidate errors
  @action protected setFormValidationErrors = (errors: FormValidationErrors) => {
    this.API.errors = errors && Object.keys(errors).length ? errors : null;
    this.setIsValid(this.API.errors === null);
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
        isDirty: false,
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

    this.updateValues(name, initialValue);
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

    this.setFieldMeta(field, {
      isMounted: true,
      isRegistered: true,
    });

    this.updateValues(name, field.value);
  };

  // called when field is unmounted
  @action unRegisterField = (name: string) => {
    const field = this.fields.get(name)!;
    if (field.props!.persist) {
      this.setFieldMeta(field, {
        isMounted: false,
      })

      this.updateIsDirtyBasedOnFields();
    } else {
      this.updateIsDirtyBasedOnFields();
      this.fields.delete(name);
    }

    this.updateValues(name, undefined);
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
        isDirty: false,
        isTouched: false,
        isChanged: false,
      },
    };
  };

  @action protected updateIsDirtyBasedOnFields = () => {
    const fields = Array.from(this.fields.values());
    this.setIsDirty(fields.some((field) => field.meta.isMounted && field.meta.isDirty))
  };

  @action protected setIsDirty = (state: boolean) => {
    this.API.meta.isDirty = state;
  };

  @action protected setIsTouched = (state: boolean) => {
    this.API.meta.isTouched = state;
  };

  @action protected updateIsChangedBasedOnFields = () => {
    const fields = Array.from(this.fields.values());
    this.setIsChanged(fields.some((field) => field.meta.isMounted && field.meta.isChanged))
  };

  @action protected setIsChanged = (state: boolean) => {
    this.API.meta.isChanged = state;
  }

  @action protected setIsValid = (state: boolean) => {
    this.API.meta.isValid = state;
  };

  @action protected setIsValidating = (state: boolean) => {
    this.API.meta.isValidating = state;
  };

  @action protected setIsSubmitting = (state: boolean) => {
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
      this.setFieldMeta(field, {
        isTouched: false,
        isChanged: false,
        isDirty: false,
      });
      this.updateValues(fieldName, newValue);
    });
    this.setIsTouched(false);
    this.setIsDirty(false);
    this.setIsChanged(false);
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
      this.setFieldMeta(field, {
        isTouched: true,
      })
      this.setIsTouched(true);
    }
    this.setFieldMeta(field, {
      isActive,
    })
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

    this.setFieldMeta(field, {
      isChanged: true,
      isDirty: !field.meta.onEqualityCheck(field.value, field.meta.initialValue)
    });

    this.updateIsChangedBasedOnFields();
    this.updateIsDirtyBasedOnFields();

    this.updateValues(fieldName, value);
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

    this.setFieldMeta(field, {
      isValidating: true,
    })

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

    this.setFieldMeta(field, {
      isValidating: false,
    })
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
