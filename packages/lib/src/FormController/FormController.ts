import React from 'react';
import ReactDOM from 'react-dom';
import {computed, extendObservable, observable, runInAction, toJS} from 'mobx';
import {observerBatching} from 'mobx-react';
import {utils} from './utils';
import merge from 'lodash/merge';
import cloneDeep from 'lodash/cloneDeep';
import type {FieldClass, FieldProps, FormatterFunction, ValidationFunction} from '../Field';
import type {
  FieldDictionary,
  FieldValidationState,
  FormAPI,
  FormControllerOptions,
  FormField,
  FormFieldMeta,
  FormValidationErrors,
  FormValues,
  Invalid,
} from './FormController.types';

export class FormController {
  //Form options passed through form Props or directly through new Controller(options)
  @observable protected options!: FormControllerOptions;

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
        utils.setValue(
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
      utils.setValue(values, fieldName, this.fieldFormatters[fieldName](utils.getValue(this.values, fieldName)));
    });

    return onFormat ? onFormat(values) : values;
  }

  protected setInitialValuesToCurrentValues = () => {
    runInAction('setInitialValuesToCurrentValues', () => {
      this.options.initialValues = this.values;
      this.fields.forEach((field: FormField) => {
        if (field.instance) { //TODO: add test for the case when there are initialValues, but field was not mounted
          field.meta.initialValue = utils.getValue(this.options.initialValues, field.props!.name);
        }
      });
    });
  };

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

        runInAction('runFieldLevelValidations:fieldMeta.isValidating', () => (fieldMeta.isValidating = true));

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
            runInAction('runFieldLevelValidations:fieldMeta.isValidating', () => (fieldMeta.isValidating = false));

            pendingValidationCount--;

            if (pendingValidationCount === 0) {
              resolve(errors);
            }
          });
      });
    });
  };

  //All onValidate errors
  @observable
  protected errors: FormValidationErrors = null;

  protected setErrors = (errors: FormValidationErrors) => {
    runInAction('setErrors', () => {
      this.errors = errors && Object.keys(errors).length ? errors : null;
    });
  };

  //all registered form fields, new field is being added when Field constructor is called
  fields = observable.map<string, FormField>();

  //validates particular field by calling field level validator passed to Field as a `validate` prop
  protected validateField = (name: string) => {
    return this.fieldValidations[name](utils.getValue(this.values, name), this.values);
  };

  protected addVirtualField = (name: string) => {
    runInAction('addVirtualField', () => {
      const self = this;

      const metaProps: FormFieldMeta = {
        onEqualityCheck: (a: any, b: any) => a === b,
        customState: observable.map(),
        initialValue: undefined,
        isTouched: false,
        isChanged: false,
        isActive: false,
        isValidating: false,
        isRegistered: false,
        get isDirty() {
          const field = self.fields.get(name)!;
          return !field.meta.onEqualityCheck(field.value, field.meta.initialValue);
        },
      };

      const meta = extendObservable({}, metaProps);

      this.fields.set(name, {
        instance: null,
        errors: null,
        value: undefined,
        props: undefined,
        meta,
      });
    });
  };

  //used for first time field creation
  protected initializeVirtualField = (fieldInstance: FieldClass, props: FieldProps) => {
    runInAction('initializeVirtualField', () => {
      const {name, onEqualityCheck} = props;
      const field = this.fields.get(name);

      const initialValue =
        utils.getValue(this.options.initialValues, name) !== undefined
          ? utils.getValue(this.options.initialValues, name)
          : props.defaultValue;

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
    });
  };

  //used for cases when field was created, unmounted and created again
  protected initializeAlreadyExistedField = (fieldInstance: FieldClass, props: FieldProps) => {
    runInAction('initializeAlreadyExistedField', () => {
      const field = this.fields.get(props.name)!;

      field.instance = fieldInstance;
      field.props = props;
    });
  };

  //general handler for registering the field upon it's mounting
  registerField = (fieldInstance: FieldClass, props: FieldProps) => {
    runInAction('registerField', () => {
      const {name} = props;
      if (this.fields.has(name) && this.fields.get(name)!.meta.isRegistered) {
        this.initializeAlreadyExistedField(fieldInstance, props);
      } else {
        this.addVirtualField(name);
        this.initializeVirtualField(fieldInstance, props);
      }
    });
  };

  protected updateErrorsForEveryField = (formValidationErrors: FormValidationErrors) => {
    runInAction('updateErrorsForEveryField', () => {
      this.fields.forEach((field) => {
        if (field.instance) {
          const errors: FieldValidationState = formValidationErrors && formValidationErrors[field.props!.name];

          field.errors = errors ? errors : null;
        }
      });
    });
  };

  protected getFieldMeta = (fieldName: string) => {
    this.createFieldIfDoesNotExist(fieldName);
    return toJS(this.fields.get(fieldName)!.meta);
  };

  constructor(options: FormControllerOptions) {
    runInAction('constructor', () => (this.options = options));
    if (observerBatching /* mobx-react >= 6.0.0 */) {
      observerBatching(ReactDOM.unstable_batchedUpdates as any);
    }
  }

  //form FormAPI, which will be passed to child render function or could be retrieved with API prop from controller
  @computed
  get API(): FormAPI {
    return {
      values: this.formattedValues,
      errors: this.errors,
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

  //where any of the form fields ever under user focus
  @computed
  get isTouched(): boolean {
    const fieldValues = Array.from(this.fields.values());
    return fieldValues.some((field: FormField) => field.instance !== null && field.meta.isTouched);
  }

  //where any of the form fields ever changed
  @computed
  get isChanged(): boolean {
    const fieldValues = Array.from(this.fields.values());
    return fieldValues.some((field: FormField) => field.instance !== null && field.meta.isChanged);
  }

  //any of the fields have value different from the initial
  @computed
  get isDirty(): boolean {
    const fieldValues = Array.from(this.fields.values());
    return fieldValues.some((field: FormField) => field.instance !== null && field.meta.isDirty);
  }

  //changed, upon form onValidate invocation
  @computed
  get isValid(): boolean {
    return this.errors === null;
  }

  //changed, when form starts/finishes validation process
  @observable
  isValidating: boolean = false;
  setIsValidating = (state: boolean) => runInAction('setIsValidating', () => (this.isValidating = state));

  //changed, when form starts/finishes submit process
  @observable
  isSubmitting: boolean = false;
  setIsSubmitting = (state: boolean) => runInAction('setIsSubmitting', () => (this.isSubmitting = state));

  //increments upon every submit try
  @observable
  submitCount: number = 0;
  setSubmitCount = (state: number) => runInAction('setSubmitCount', () => (this.submitCount = state));

  //general handler for resetting form to specific state
  resetToValues = (values: FormValues) => {
    runInAction('resetToValues', () => {
      this.fields.forEach((field: FormField, name: string) => {
        field.value = utils.getValue(values, name);
        field.meta.isTouched = false;
        field.meta.isChanged = false;
      });
      this.setInitialValuesToCurrentValues();
      this.setSubmitCount(0);
      this.updateErrorsForEveryField({});
    });
  };

  //resets the form to initial values
  reset = () => {
    return this.resetToValues(this.options.initialValues || {});
  };

  //resets the form to empty values
  clear = () => {
    return this.resetToValues({});
  };

  //called when field is unmounted
  unRegisterField = (fieldName: string) => {
    runInAction('unRegisterField', () => {
      const field = this.fields.get(fieldName)!;
      if (field.props!.persist) {
        field.instance = null;
      } else {
        this.fields.delete(fieldName);
      }
    });
  };

  //changes field active state usually based on 'blur'/'focus' events called within the adapter
  changeFieldActiveState = (fieldName: string, isActive: boolean) => {
    runInAction('changeFieldActiveState', () => {
      const field = this.fields.get(fieldName)!;
      if (isActive) {
        field.meta.isTouched = true;
      }
      field.meta.isActive = isActive;
    });
  };

  //changes field custom state, that was set by user
  setFieldCustomState = (fieldName: string, key: string, value: any) => {
    runInAction('setFieldCustomState', () => {
      this.createFieldIfDoesNotExist(fieldName);
      this.fields.get(fieldName)!.meta.customState.set(key, value);
    });
  };

  //changes when adapted onChange handler is called
  setFieldValue = (fieldName: string, value: any) => {
    runInAction('setFieldValue', () => {
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

  //validates the form, by calling form level onValidate function combined with field level validations
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

  //wraps submit function passed as Form `onSubmit` prop and after it's being passed to child render function
  submit = async <E>(submitEvent?: React.FormEvent<E>) => {
    if (submitEvent) {
      submitEvent.persist();
      submitEvent.preventDefault();
    }

    runInAction('submit:start', () => {
      this.setSubmitCount(this.submitCount + 1);
      this.setIsSubmitting(true);
    });

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
    } finally {
      this.setIsSubmitting(false);
    }

    if (this.options.onSubmitAfter) {
      this.options.onSubmitAfter(errors, values, submitEvent);
    }

    return {errors, values};
  };
}
