import React from 'react';
import ReactDOM from 'react-dom';
import {computed, observable, runInAction} from 'mobx';
import {observerBatching} from 'mobx-react';
import {utils} from './utils';
import merge from 'lodash/merge';
import cloneDeep from 'lodash/cloneDeep';
import {toJSCompat} from '../utils/toJSCompat';
import {makeObservableForMobx6} from '../utils/makeObservableForMobx6';
import isEmpty from 'lodash/isEmpty';
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
  @observable protected options!: FormControllerOptions;

  // get all field level validations
  @computed
  protected get fieldFormatters() {
    const fieldFormatters: FieldDictionary<FormatterFunction> = {};
    this.fields.forEach((field: FormField, name: string) => {
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

    this.fields.forEach((field: FormField, name: string) => {
      if (field.meta.isMounted && field.props!.onValidate) {
        fieldValidations[name] = field.props!.onValidate as ValidationFunction;
      }
    });

    return fieldValidations;
  }

  // get all field values
  @computed
  protected get values() {
    const values = {};

    this.fields.forEach((field: FormField, name: string) => {
      if (field.meta.isMounted) {
        utils.setValue(values, name, toJSCompat(field.value, false));
      }
    });

    return values;
  }

  // used for passing safe copy of values to users form child render function
  @computed
  protected get formattedValues() {
    const {onFormat} = this.options;
    const values = cloneDeep(this.values);

    Object.keys(this.fieldFormatters).forEach((fieldName) => {
      utils.setValue(values, fieldName, this.fieldFormatters[fieldName](utils.getValue(this.values, fieldName)));
    });

    return onFormat ? onFormat(values) : values;
  }

  protected setInitialValuesToCurrentValues = (values: FormValues = this.values) => {
    runInAction(() => {
      this.options.initialValues = values;

      this.fields.forEach((field: FormField) => {
        if (field.meta.isMounted) {
          field.meta.initialValue = utils.getValue(this.options.initialValues, field.props!.name);
        }
      });
    });
  };

  // executes general form validator passed to Form as a `onValidate` prop and returns errors
  protected runFormLevelValidations = (): Promise<FieldDictionary<Invalid> | {}> => {
    return this.options.onValidate ? this.options.onValidate(this.formattedValues) : Promise.resolve({});
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
        const fieldMeta = this.fields.get(fieldName)!.meta;

        runInAction(() => (fieldMeta.isValidating = true));

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
            runInAction(() => (fieldMeta.isValidating = false));

            pendingValidationCount--;

            if (pendingValidationCount === 0) {
              resolve(errors);
            }
          });
      });
    });
  };

  // all onValidate errors
  @observable
  protected formValidationErrors: FormValidationErrors = null;

  protected setFormValidationErrors = (errors: FormValidationErrors) => {
    runInAction(() => {
      this.formValidationErrors = errors && Object.keys(errors).length ? errors : null;
    });
  };

  // all registered form fields, new field is being added when Field constructor is called
  fields = observable.map<string, FormField>();

  // runs validation for particular field
  protected runFieldLevelValidation = (name: string) => {
    return this.fieldValidations[name](utils.getValue(this.formattedValues, name), this.formattedValues);
  };

  protected addVirtualField = (name: string) => {
    runInAction(() => {
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
    });
  };

  // used for first time field creation
  protected initializeVirtualField = (props: FieldProps) => {
    runInAction(() => {
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
    });
  };

  // used for cases when field was created, unmounted and created again
  protected initializeAlreadyExistedField = (props: FieldProps) => {
    runInAction(() => {
      const field = this.fields.get(props.name)!;
      field.props = props;
    });
  };

  // called when field is mounted
  registerField = (props: FieldProps) => {
    runInAction(() => {
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
    });
  };

  // called when field is unmounted
  unRegisterField = (name: string) => {
    runInAction(() => {
      const field = this.fields.get(name)!;
      if (field.props!.persist) {
        field.meta.isMounted = false;
      } else {
        this.fields.delete(name);
      }
    });
  };

  protected updateFieldErrors = (field: FormField, errors: FieldValidationState = null) => {
    if (field.meta.isMounted) {
      field.errors = errors;
    }
  };

  protected updateErrorsForEveryField = (formValidationErrors: FormValidationErrors) => {
    runInAction(() => {
      this.fields.forEach((field) => {
        this.updateFieldErrors(field, formValidationErrors && formValidationErrors[field.props!.name]);
      });
    });
  };

  protected getFieldMeta = (fieldName: string) => {
    this.createFieldIfDoesNotExist(fieldName);
    return toJSCompat(this.fields.get(fieldName)!.meta);
  };

  constructor(options: FormControllerOptions) {
    makeObservableForMobx6(this);
    runInAction(() => (this.options = options));
    observerBatching(ReactDOM.unstable_batchedUpdates);
  }

  // form FormAPI, which will be passed to child render function or could be retrieved with API prop from controller
  @computed
  get API(): FormAPI {
    return {
      values: this.formattedValues,
      errors: this.formValidationErrors,
      submit: this.submit,
      reset: this.reset,
      resetToValues: this.resetToValues,
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
        isChanged: this.isChanged,
      },
    };
  }

  // where any of the form fields ever under user focus
  @computed
  get isTouched(): boolean {
    const fieldValues = Array.from(this.fields.values());
    return fieldValues.some((field: FormField) => field.meta.isMounted && field.meta.isTouched);
  }

  // where any of the form fields ever changed
  @computed
  get isChanged(): boolean {
    const fieldValues = Array.from(this.fields.values());
    return fieldValues.some((field: FormField) => field.meta.isMounted && field.meta.isChanged);
  }

  // any of the fields have value different from the initial
  @computed
  get isDirty(): boolean {
    const fieldValues = Array.from(this.fields.values());
    return fieldValues.some((field: FormField) => field.meta.isMounted && field.meta.isDirty);
  }

  // changed, upon form onValidate invocation
  @computed
  get isValid(): boolean {
    return this.formValidationErrors === null;
  }

  // changed, when form starts/finishes validation process
  @observable
  isValidating: boolean = false;
  setIsValidating = (state: boolean) => runInAction(() => (this.isValidating = state));

  // changed, when form starts/finishes submit process
  @observable
  isSubmitting: boolean = false;
  setIsSubmitting = (state: boolean) => runInAction(() => (this.isSubmitting = state));

  // increments upon every submit try
  @observable
  submitCount: number = 0;
  setSubmitCount = (state: number) => runInAction(() => (this.submitCount = state));

  // general handler for resetting form to specific state
  resetToValues = (values: FormValues) => {
    runInAction(() => {
      this.fields.forEach((field: FormField, name: string) => {
        field.value = utils.getValue(values, name);
        field.meta.isTouched = false;
        field.meta.isChanged = false;
      });
      this.setInitialValuesToCurrentValues(values);
      this.setSubmitCount(0);
      this.updateErrorsForEveryField({});
    });
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
  changeFieldActiveState = (fieldName: string, isActive: boolean) => {
    runInAction(() => {
      const field = this.fields.get(fieldName)!;
      if (isActive) {
        field.meta.isTouched = true;
      }
      field.meta.isActive = isActive;
    });
  };

  // changes field custom state, that was set by user
  setFieldCustomState = (fieldName: string, key: string, value: any) => {
    runInAction(() => {
      this.createFieldIfDoesNotExist(fieldName);
      this.fields.get(fieldName)!.meta.customState[key] = value;
    });
  };

  // changes when adapted onChange handler is called
  setFieldValue = (fieldName: string, value: any) => {
    runInAction(() => {
      this.createFieldIfDoesNotExist(fieldName);
      const field = this.fields.get(fieldName)!;
      field.value = value;
      if (!field.meta.isChanged) {
        field.meta.isChanged = true;
      }
    });
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
    const fieldMeta = field.meta;

    runInAction(() => (fieldMeta.isValidating = true));

    const errors = await (async () => {
      try {
        const result = await this.runFieldLevelValidation(fieldName);
        if (result !== undefined && result !== null) {
          return result;
        }
      } catch (e) {
        return e;
      }
    })();

    runInAction(() => (fieldMeta.isValidating = false));
    this.setFormValidationErrors(merge(this.formValidationErrors, {[fieldName]: errors}));
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

    this.updateErrorsForEveryField(this.formValidationErrors);

    this.setIsValidating(false);
  };

  // wraps submit function passed as Form `onSubmit` prop after it's being passed to child render function
  submit = async <E>(submitEvent?: React.FormEvent<E>) => {
    if (submitEvent) {
      submitEvent.persist();
      submitEvent.preventDefault();
    }

    runInAction(() => {
      this.setSubmitCount(this.submitCount + 1);
      this.setIsSubmitting(true);
    });

    await this.validate();

    const errors = toJSCompat(this.formValidationErrors);
    const values = toJSCompat(this.formattedValues);

    try {
      if (this.options.onSubmit) {
        await this.options.onSubmit(errors, values, submitEvent);
      }

      if (this.formValidationErrors === null) {
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
