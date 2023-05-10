import React from 'react';
import ReactDOM from 'react-dom';
import {action, observable, runInAction} from 'mobx';
import {observerBatching} from 'mobx-react';
import _cloneDeep from 'lodash/cloneDeep';
import _set from 'lodash/set';
import _get from 'lodash/get';
import {toJSCompat} from '../utils/toJSCompat';
import type {FieldProps, OnValidateFunction} from '../Field/Field.types';
import type {FormAPI, FormControllerOptions, FormagusEvent, FormField, Values} from './FormControllerClass.types';
import type {WithRequiredProperty} from '../utils/types/withRequiredProperty';
import {isMobx6Used} from '../utils/isMobx6Used';
import {isEmpty} from '../utils/isEmpty';
import {mergeDeep} from '../utils/mergeDeep';

const {makeObservable} = require('mobx'); // require as import might not work in case of mobx5 bundling in userland

export class FormControllerClass {
  // Form options passed through form Props or directly through new Controller(options)
  protected options: WithRequiredProperty<FormControllerOptions, 'fieldValueToFormValuesConverter'>;

  constructor(options: FormControllerOptions) {
    if (observerBatching) {
      observerBatching(ReactDOM.unstable_batchedUpdates);
    }

    if (isMobx6Used()) {
      makeObservable(this);
    }

    this.options = {
      ...options,
      shouldBatchValidationUpdates: options.shouldBatchValidationUpdates ?? true,
      fieldValueToFormValuesConverter: options.fieldValueToFormValuesConverter || {
        get: _get,
        set: _set,
      },
    };

    this.createFormApi();
  }

  @observable protected fieldLevelValidations: Record<string, OnValidateFunction> = {};

  @action protected addFieldLevelValidation = (fieldName: string, onValidateFunction: OnValidateFunction) => {
    this.fieldLevelValidations[fieldName] = onValidateFunction;
  };

  @action removeFieldLevelValidation = (fieldName: string) => {
    delete this.fieldLevelValidations[fieldName];
  };

  protected safeApiValuesCopy: Record<string, unknown> = {};

  @action protected updateAPIValues = (fieldName: string, value: unknown) => {
    const safeValue = toJSCompat(value, false);
    const {onFormat} = this.options;
    const field = this.fields.get(fieldName);

    this.options.fieldValueToFormValuesConverter.set(
      this.safeApiValuesCopy,
      fieldName,
      field && field.fieldProps?.onFormat && field.meta.isMounted ? field.fieldProps.onFormat(safeValue) : safeValue,
    );

    if (onFormat) {
      this.safeApiValuesCopy = onFormat(this.safeApiValuesCopy);
    }

    this.API.values = _cloneDeep(this.safeApiValuesCopy);
  };

  // eslint-disable-next-line class-methods-use-this
  @action protected setFieldMeta = (field: FormField, meta: Partial<FormField['meta']>) => {
    Object.assign(field.meta, meta);
  };

  @action protected updateInitialValues = (values?: unknown) => {
    if (values) {
      this.options.initialValues = values;
    }

    this.fields.forEach((field, name) => {
      if (field.meta.isMounted) {
        if (!values) {
          this.options.fieldValueToFormValuesConverter.set(this.options.initialValues, name, field.value);
        }
        const initialValue = this.options.fieldValueToFormValuesConverter.get(this.options.initialValues, name);
        this.setFieldMeta(field, {
          initialValue,
          isDirty: !field.meta.onEqualityCheck(field.value, initialValue),
        });
      }
    });
  };

  // executes general form validator passed to Form as a `onValidate` prop and returns errors
  protected runFormLevelValidations = () => {
    return this.options.onValidate?.(toJSCompat(this.API.values));
  };

  // executes all field level validators passed to Fields as a `onValidate` prop and returns errors
  protected runFieldLevelValidations = () => {
    let pendingValidationCount = Object.keys(this.fieldLevelValidations).length;

    if (pendingValidationCount === 0) {
      return undefined;
    }

    const errors: Record<string, unknown> = {};

    return new Promise<typeof errors>((resolve) => {
      Object.keys(this.fieldLevelValidations).forEach((fieldName) => {
        const field = this.fields.get(fieldName)!;

        if (!this.options.shouldBatchValidationUpdates) {
          this.setFieldMeta(field, {
            isValidating: true,
          });
        }

        Promise.resolve(this.runFieldLevelValidation(fieldName))
          .then((error) => {
            if (error !== undefined && error !== null) {
              errors[fieldName] = error;
            }
          })
          .catch((error) => {
            errors[fieldName] = error;
          })
          .then(() => {
            if (!this.options.shouldBatchValidationUpdates) {
              this.setFieldMeta(field, {
                isValidating: false,
              });
            }

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

  // eslint-disable-next-line class-methods-use-this
  @action protected setFieldErrors = (field: FormField, errors?: unknown) => {
    // eslint-disable-next-line no-param-reassign
    field.errors = errors;
  };

  @action protected updateErrors = (params: {value: unknown} | {mutator: Function}) => {
    if ('value' in params) {
      if (typeof params.value === 'object' && params.value !== null) {
        this.API.errors = params.value;
      } else {
        this.API.errors = {};
      }
    } else {
      params.mutator();
    }

    this.setIsValid(Object.keys(this.API.errors).length === 0);
  };

  // runs validation for particular field
  protected runFieldLevelValidation = (fieldName: string) => {
    return this.fieldLevelValidations[fieldName](
      this.options.fieldValueToFormValuesConverter.get(this.API.values, fieldName),
      this.API.values,
    );
  };

  @action protected addVirtualField = (fieldName: string) => {
    this.fields.set(fieldName, {
      errors: undefined,
      value: undefined,
      fieldProps: undefined,
      validateField: () => this.validateField(fieldName),
      validate: () => this.validate(),
      onChange: (value: unknown) => this.setFieldValue(fieldName, value),
      /** @deprecated */
      setCustomState: (key: string, value: unknown) => this.setFieldCustomState(fieldName, key, value),
      onFocus: () => this.changeFieldActiveState(fieldName, true),
      onBlur: () => this.changeFieldActiveState(fieldName, false),
      meta: {
        onEqualityCheck: (a: unknown, b: unknown) => a === b || (isEmpty(a) && isEmpty(b)),
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
    const {get} = this.options.fieldValueToFormValuesConverter;
    const field = this.fields.get(name)!;

    const initialValue =
      get(this.options.initialValues, name) !== undefined ? get(this.options.initialValues, name) : props.defaultValue;

    field.fieldProps = {
      ...props,
      persist,
    };
    field.value = initialValue;

    this.setFieldMeta(field, {
      initialValue,
      ...(onEqualityCheck && {onEqualityCheck}),
    });

    this.updateAPIValues(name, initialValue);
  };

  // called when field is mounted
  @action registerField = (props: FieldProps) => {
    const {name, onValidate} = props;

    // used for cases when field was created, unmounted and created again
    if (this.fields.get(name)?.meta.isRegistered) {
      this.fields.get(name)!.fieldProps = props;
    } else {
      this.addVirtualField(name);
      this.initializeVirtualField(props);
    }

    const field = this.fields.get(name)!;

    this.setFieldMeta(field, {
      isMounted: true,
      isRegistered: true,
    });

    if (onValidate) {
      this.addFieldLevelValidation(name, onValidate);
    }

    this.updateAPIValues(name, field.value);
  };

  // called when field is unmounted
  @action unRegisterField = (fieldName: string) => {
    const field = this.fields.get(fieldName)!;
    if (field.fieldProps!.persist) {
      this.setFieldMeta(field, {
        isMounted: false,
      });
    } else {
      this.fields.delete(fieldName);
    }

    this.updateIsDirtyBasedOnFields();
    this.removeFieldLevelValidation(fieldName);
    this.updateAPIValues(fieldName, undefined);
  };

  @action protected updateErrorsForEveryField = (formValidationErrors: unknown) => {
    this.fields.forEach((field, name) => {
      if (field.meta.isMounted) {
        const errors =
          typeof formValidationErrors === 'object' && formValidationErrors !== null
            ? formValidationErrors[name as keyof typeof formValidationErrors]
            : undefined;

        this.setFieldErrors(field, errors);
      }
    });
  };

  protected hasField = (fieldName: string) => {
    const field = this.fields.get(fieldName);
    return field?.meta.isMounted ?? false;
  };

  // form FormAPI, which will be passed to child render function or could be retrieved with API prop from controller
  @observable API: FormAPI = {} as any;

  @action protected createFormApi = () => {
    this.API = {
      values: {},
      errors: {},
      submit: this.submit,
      resetToValues: this.resetToValues,
      hasField: this.hasField,
      reset: () => this.resetToValues(this.options.initialValues || {}), // resets the form to initial values
      clear: () => this.resetToValues({}), // resets the form to empty values
      setFieldValue: this.setFieldValue,
      validate: this.validate,
      validateField: this.validateField,
      getField: this.getField,
      getFields: this.getFields,
      meta: {
        isValidating: false,
        isSubmitting: false,
        submitCount: 0,
        isValid: true,
        isDirty: false,
        isTouched: false,
        isChanged: false,
      },
      setFieldCustomState: this.setFieldCustomState,
    };
  };

  protected getField = (fieldName: string) => {
    return this.fields.get(fieldName);
  };

  protected getFields = () => {
    return Array.from(this.fields.entries()).reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {} as Record<string, FormField>);
  };

  @action protected updateIsDirtyBasedOnFields = () => {
    const fields = Array.from(this.fields.values());
    this.setIsDirty(fields.some((field) => field.meta.isMounted && field.meta.isDirty));
  };

  @action protected setIsDirty = (state: boolean) => {
    this.API.meta.isDirty = state;
  };

  @action protected setIsTouched = (state: boolean) => {
    this.API.meta.isTouched = state;
  };

  @action protected updateIsChangedBasedOnFields = () => {
    const fields = Array.from(this.fields.values());
    this.setIsChanged(fields.some((field) => field.meta.isMounted && field.meta.isChanged));
  };

  @action protected setIsChanged = (state: boolean) => {
    this.API.meta.isChanged = state;
  };

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
  @action protected setSubmitCount = (state: number) => {
    this.API.meta.submitCount = state;
  };

  // general handler for resetting form to specific state
  @action protected resetToValues = (values: Values) => {
    this.fields.forEach((field, name) => {
      const newValue = this.options.fieldValueToFormValuesConverter.get(values, name);
      const fieldName = field.fieldProps?.name!;
      // eslint-disable-next-line no-param-reassign
      field.value = newValue;
      this.setFieldMeta(field, {
        isTouched: false,
        isChanged: false,
        isDirty: false,
      });
      this.updateAPIValues(fieldName, newValue);
    });
    this.setIsTouched(false);
    this.setIsDirty(false);
    this.setIsChanged(false);
    this.updateInitialValues(values);
    this.setSubmitCount(0);
    this.updateErrorsForEveryField(undefined);
  };

  // changes field active state usually based on 'blur'/'focus' events called within the adapter
  @action protected changeFieldActiveState = (fieldName: string, isActive: boolean) => {
    const field = this.fields.get(fieldName)!;
    if (isActive) {
      this.setFieldMeta(field, {
        isTouched: true,
      });
      this.setIsTouched(true);
    }
    this.setFieldMeta(field, {
      isActive,
    });
  };

  // changes field custom state, that was set by user
  /** @deprecated */
  @action protected setFieldCustomState = (fieldName: string, key: string, value: unknown) => {
    this.createFieldIfDoesNotExist(fieldName);
    const field = this.fields.get(fieldName)!;

    this.setFieldMeta(field, {
      customState: {
        ...field.meta.customState,
        [key]: value,
      },
    });
  };

  // changes when adapter onChange handler is called
  @action protected setFieldValue = (fieldName: string, value: unknown) => {
    this.createFieldIfDoesNotExist(fieldName);
    const field = this.fields.get(fieldName)!;

    field.value = value;

    this.setFieldMeta(field, {
      isChanged: true,
      isDirty: !field.meta.onEqualityCheck(field.value, field.meta.initialValue),
    });

    this.updateIsChangedBasedOnFields();
    this.updateIsDirtyBasedOnFields();

    this.updateAPIValues(fieldName, value);
  };

  protected createFieldIfDoesNotExist = (fieldName: string) => {
    if (!this.fields.has(fieldName)) {
      this.addVirtualField(fieldName);
    }
  };

  // validates single field by calling field level validation, passed to Field as `validate` prop
  protected validateField = async (fieldName: string) => {
    if (!this.fieldLevelValidations[fieldName]) {
      return undefined;
    }

    const field = this.fields.get(fieldName)!;

    runInAction(() => {
      this.setIsValidating(true);
      this.setFieldMeta(field, {
        isValidating: true,
      });
    });

    const errors = await new Promise((resolve) => {
      Promise.resolve(this.runFieldLevelValidation(fieldName))
        .then((result: unknown) => {
          resolve(result);
        })
        .catch((e: Error) => {
          return resolve(e);
        });
    });

    runInAction(() => {
      this.setFieldMeta(field, {
        isValidating: false,
      });

      this.updateErrors({
        mutator: () => {
          if (isEmpty(errors)) {
            delete this.API.errors[fieldName];
          } else {
            this.API.errors[fieldName] = errors;
          }
        },
      });

      if (field.meta.isMounted) {
        this.setFieldErrors(field, errors);
      }

      this.setIsValidating(false);
    });

    return errors;
  };

  // validates the form, by calling form level onValidate function combined with field level validations,
  // passed to Field as `onValidate` prop
  protected validate = async () => {
    this.triggerEvent({type: 'validate:begin'});

    const hasFieldLevelValidations = Object.keys(this.fieldLevelValidations).length > 0;

    const updateFieldIsValidating = (isValidating: boolean) => {
      if (hasFieldLevelValidations) {
        this.fields.forEach((field) => {
          this.setFieldMeta(field, {
            isValidating,
          });
        });
      }
    };

    runInAction(() => {
      this.setIsValidating(true);
      if (this.options.shouldBatchValidationUpdates) {
        updateFieldIsValidating(true);
      }
    });

    const [fieldValidationErrors, formValidationErrors] = await Promise.all([
      hasFieldLevelValidations ? this.runFieldLevelValidations() : {},
      this.options.onValidate ? this.runFormLevelValidations() : {},
    ]);

    const combinedErrors = mergeDeep(fieldValidationErrors, formValidationErrors);

    runInAction(() => {
      if (this.options.shouldBatchValidationUpdates) {
        updateFieldIsValidating(false);
      }
      this.updateErrors({value: combinedErrors});
      this.updateErrorsForEveryField(this.API.errors);
      this.setIsValidating(false);
    });

    this.triggerEvent({type: 'validate:end'});

    return combinedErrors;
  };

  // wraps submit function passed as Form `onSubmit` prop after it's being passed to child render function
  @action protected submit = async <E extends HTMLElement = HTMLElement>(submitEvent?: React.FormEvent<E>) => {
    this.triggerEvent({type: 'submit:begin'});

    if (submitEvent) {
      submitEvent.persist();
      submitEvent.preventDefault();
    }

    runInAction(() => {
      this.setSubmitCount(this.API.meta.submitCount + 1);
      this.setIsSubmitting(true);
    });

    await this.validate();

    const [errors, values] = toJSCompat([this.API.errors, this.API.values]);
    const isSuccess = isEmpty(errors);

    try {
      if (this.options.onSubmit) {
        await this.options.onSubmit({errors, values, isSuccess, event: submitEvent});
      }

      runInAction(() => {
        if (isEmpty(errors)) {
          this.updateInitialValues();
          this.updateIsDirtyBasedOnFields();
        }
        this.setIsSubmitting(false);
      });
    } catch {
      this.setIsSubmitting(false);
    }

    this.triggerEvent({type: 'submit:end'});

    return {errors, values, isSuccess};
  };

  protected triggerEvent = (event: FormagusEvent) => {
    if (this.options.onEvent) {
      this.options.onEvent(event);
    }
  };
}
