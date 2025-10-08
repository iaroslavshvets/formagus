import ReactDOM from 'react-dom';
import {observable, runInAction} from 'mobx';
import {observerBatching} from 'mobx-react-lite';
import {get, set} from 'lodash';
import {toJSCompat} from '../utils/toJSCompat';
import {type FieldProps, type OnValidateFunction} from '../Field/Field.types';
import {type FormApi, type FormControllerOptions, type FormField, type Values} from './FormControllerClass.types';
import {isMobx6Used} from '../utils/isMobx6Used';
import {isEmpty} from '../utils/isEmpty';
import {mergeDeep} from '../utils/mergeDeep';
import {makeObservableForMobx6} from '../utils/makeObservableForMobx6';
import {decorateForMobx5} from '../utils/decorateForMobx5';
import {assign} from '../utils/assign';

export class FormControllerClass {
  // Form options passed through form Props or directly through new Controller(options)
  options: FormControllerOptions;

  constructor(options: FormControllerOptions) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (observerBatching) {
      observerBatching(ReactDOM.unstable_batchedUpdates);
    }

    if (isMobx6Used()) {
      makeObservableForMobx6<This, 'fieldLevelValidations'>(this, {
        fieldLevelValidations: observable.shallow,
        fields: observable.shallow,
        API: observable,
      });
    }

    this.options = options;

    this.createFormApi();
  }

  protected fieldLevelValidations: Record<string, OnValidateFunction> = {};

  protected addFieldLevelValidation = (fieldName: string, onValidateFunction: OnValidateFunction) => {
    runInAction(() => {
      this.fieldLevelValidations[fieldName] = onValidateFunction;
    });
  };

  protected updateAPIValues = (fieldName?: string, value?: unknown) => {
    runInAction(() => {
      if (fieldName) {
        const field = this.fields.get(fieldName);

        if (field?.fieldState.isMounted) {
          set(this.API.values, fieldName, field.fieldProps.onFormat ? field.fieldProps.onFormat(value) : value);
        }
      } else {
        this.API.values = {};

        this.fields.forEach((field, name) => {
          if (field.fieldState.isMounted) {
            set(
              this.API.values,
              name,
              field.fieldProps.onFormat ? field.fieldProps.onFormat(field.value) : field.value,
            );
          }
        });
      }

      if (this.options.onFormat) {
        this.API.values = this.options.onFormat(this.API.values);
      }
    });
  };

  protected updateInitialValues = (values?: unknown) => {
    runInAction(() => {
      if (values) {
        this.options.initialValues = values;
      }

      this.fields.forEach((field, name) => {
        if (field.fieldState.isMounted) {
          if (!values) {
            set(this.options.initialValues, name, field.value);
          }

          const initialValue = get(this.options.initialValues, name);

          assign(field.fieldState, {
            isDirty: !field.fieldState.onEqualityCheck(field.value, initialValue),
            initialValue,
          });
        }
      });
    });
  };

  // executes general form validator passed to Form as a `onValidate` prop and returns errors
  protected runFormLevelValidations = () => {
    return this.options.onValidate ? this.options.onValidate(toJSCompat(this.API.values)) : {};
  };

  // executes all field level validators passed to Fields as a `onValidate` prop and returns errors
  protected runFieldLevelValidations = async () => {
    if (isEmpty(this.fieldLevelValidations)) {
      return {};
    }

    const errors: Record<string, unknown> = {};

    await Promise.all(
      Object.keys(this.fieldLevelValidations).map(async (fieldName) => {
        const field = this.fields.get(fieldName)!;

        runInAction(() => {
          field.fieldState.isValidating = true;
        });

        const error = await this.runFieldLevelValidation(fieldName);

        if (error !== undefined && error !== null) {
          errors[fieldName] = error;
        }

        runInAction(() => {
          field.fieldState.isValidating = false;
        });
      }),
    );

    return errors;
  };

  // all registered form fields, new field is being added when Field constructor is called
  fields = new Map<string, FormField>();

  // runs validation for particular field
  protected runFieldLevelValidation = (fieldName: string) => {
    return this.fieldLevelValidations[fieldName]?.(get(this.API.values, fieldName), this.API.values);
  };

  protected addVirtualField = (fieldName: string) => {
    runInAction(() => {
      const rawFieldProps = {
        errors: undefined,
        value: undefined,
        fieldProps: undefined as any,
        validateField: () => this.validateField(fieldName),
        validate: () => this.validate(),
        onChange: (value: unknown) => {
          this.setFieldValue(fieldName, value);
        },
        onFocus: () => {
          this.changeFieldActiveState(fieldName, true);
        },
        onBlur: () => {
          this.changeFieldActiveState(fieldName, false);
        },
        fieldState: {
          onEqualityCheck: (a: unknown, b: unknown) => a === b || (isEmpty(a) && isEmpty(b)),
          initialValue: undefined,
          isTouched: false,
          isChanged: false,
          isActive: false,
          isValidating: false,
          isMounted: false,
          isRegistered: false,
          isDirty: false,
        },
      };

      if (isMobx6Used()) {
        const fieldProps = makeObservableForMobx6(rawFieldProps, {
          value: observable,
          errors: observable,
          fieldState: observable,
        });

        this.fields.set(fieldName, fieldProps);
      } else {
        this.fields.set(fieldName, rawFieldProps);
      }
    });
  };

  // used for first time field creation
  protected initializeVirtualField = (props: FieldProps) => {
    runInAction(() => {
      const {name, onEqualityCheck, persist = false} = props;
      const field = this.fields.get(name)!;

      const initialValue = get(this.options.initialValues, name) ?? props.defaultValue;

      field.value = initialValue;

      field.fieldProps = {
        ...props,
        persist,
      };

      assign(field.fieldState, {
        initialValue,
        ...(onEqualityCheck ? {onEqualityCheck} : {}),
      });

      this.updateAPIValues(name, initialValue);
    });
  };

  // called when field is mounted
  registerField = (props: FieldProps) => {
    runInAction(() => {
      const {name, onValidate} = props;

      // used for cases when field was created, unmounted and created again
      if (this.fields.get(name)?.fieldState.isRegistered) {
        this.fields.get(name)!.fieldProps = props;
      } else {
        this.addVirtualField(name);
        this.initializeVirtualField(props);
      }

      const field = this.fields.get(name)!;

      assign(field.fieldState, {
        isMounted: true,
        isRegistered: true,
      });

      if (onValidate) {
        this.addFieldLevelValidation(name, onValidate);
      }

      this.updateAPIValues(name, field.value);
    });
  };

  // called when field is unmounted
  unRegisterField = (name: string) => {
    runInAction(() => {
      const field = this.fields.get(name)!;

      if (field.fieldProps.persist) {
        field.fieldState.isMounted = false;
      } else {
        this.fields.delete(name);
      }

      this.updateFormIsDirtyBasedOnFields();

      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete this.fieldLevelValidations[name];

      this.updateAPIValues();
    });
  };

  protected updateErrorsForEveryField = (formValidationErrors: unknown) => {
    runInAction(() => {
      this.fields.forEach((field, name) => {
        if (field.fieldState.isMounted) {
          field.errors =
            typeof formValidationErrors === 'object' && formValidationErrors !== null
              ? formValidationErrors[name as keyof typeof formValidationErrors]
              : undefined;
        }
      });
    });
  };

  // form FormAPI, which will be passed to child render function or could be retrieved with API prop from controller
  API: FormApi = {} as any;

  protected createFormApi = () => {
    runInAction(() => {
      this.API = {
        values: {},
        errors: {},
        submit: this.submit,
        hasField: (fieldName: string) => {
          const field = this.fields.get(fieldName);
          return field?.fieldState.isMounted ?? false;
        },
        reset: (values?: Values) => {
          // resets the form to initial values or custom if provided
          this.reset(values ?? this.options.initialValues ?? {});
        },
        setFieldValue: this.setFieldValue,
        validate: this.validate,
        validateField: this.validateField,
        getField: (fieldName) => this.fields.get(fieldName),
        getFields: () => Object.fromEntries(this.fields.entries()),
        formState: {
          isValidating: false,
          isSubmitting: false,
          submitCount: 0,
          isValid: true,
          isDirty: false,
          isTouched: false,
          isChanged: false,
        },
        controller: {
          options: this.options,
        },
      };
    });
  };

  protected updateFormIsDirtyBasedOnFields = () => {
    runInAction(() => {
      let isDirty = false;
      for (const field of this.fields.values()) {
        if (field.fieldState.isMounted && field.fieldState.isDirty) {
          isDirty = true;
          break;
        }
      }
      this.API.formState.isDirty = isDirty;
    });
  };

  protected updateFormIsChangedBasedOnFields = () => {
    runInAction(() => {
      let isChanged = false;
      for (const field of this.fields.values()) {
        if (field.fieldState.isMounted && field.fieldState.isChanged) {
          isChanged = true;
          break;
        }
      }
      this.API.formState.isChanged = isChanged;
    });
  };

  // general handler for resetting form to specific state
  protected reset = (values: Values) => {
    runInAction(() => {
      this.fields.forEach((field, name) => {
        const newValue = get(values, name);
        const fieldName = field.fieldProps.name;

        field.value = newValue;

        assign(field.fieldState, {
          isTouched: false,
          isChanged: false,
          isDirty: false,
        });

        this.updateAPIValues(fieldName, newValue);
      });

      assign(this.API.formState, {
        isTouched: false,
        isDirty: false,
        isChanged: false,
        submitCount: 0,
      });

      this.updateInitialValues(values);
      this.updateErrorsForEveryField(undefined);
    });
  };

  // changes field active state usually based on 'blur'/'focus' events called within the adapter
  protected changeFieldActiveState = (fieldName: string, isActive: boolean) => {
    runInAction(() => {
      const field = this.fields.get(fieldName)!;
      if (isActive) {
        field.fieldState.isTouched = true;
        this.API.formState.isTouched = true;
      }

      field.fieldState.isActive = isActive;
    });
  };

  // changes when adapter onChange handler is called
  protected setFieldValue: FormApi['setFieldValue'] = (fieldName, value) => {
    runInAction(() => {
      this.createFieldIfDoesNotExist(fieldName);

      const field = this.fields.get(fieldName)!;

      field.value = value;

      assign(field.fieldState, {
        isChanged: true,
        isDirty: !field.fieldState.onEqualityCheck(value, field.fieldState.initialValue),
      });

      this.updateFormIsChangedBasedOnFields();
      this.updateFormIsDirtyBasedOnFields();

      this.updateAPIValues(fieldName, value);
    });
  };

  protected createFieldIfDoesNotExist = (fieldName: string) => {
    if (!this.fields.has(fieldName)) {
      this.addVirtualField(fieldName);
    }
  };

  // validates single field by calling field level validation, passed to Field as `validate` prop
  protected validateField: FormApi['validateField'] = async (fieldName) => {
    if (!this.fieldLevelValidations[fieldName]) {
      return undefined;
    }

    const field = this.fields.get(fieldName)!;

    runInAction(() => {
      this.API.formState.isValidating = true;
      field.fieldState.isValidating = true;
    });

    const errors = await this.runFieldLevelValidation(fieldName);

    runInAction(() => {
      field.fieldState.isValidating = false;

      if (isEmpty(errors)) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete this.API.errors[fieldName];
      } else {
        this.API.errors[fieldName] = errors;
      }

      if (field.fieldState.isMounted) {
        field.errors = errors;
      }

      assign(this.API.formState, {
        isValid: isEmpty(this.API.errors),
        isValidating: false,
      });
    });

    return errors;
  };

  // validates the form, by calling form level onValidate function combined with field level validations,
  // passed to Field as `onValidate` prop
  protected validate: FormApi['validate'] = async () => {
    runInAction(() => {
      this.API.formState.isValidating = true;
    });

    const [fieldValidationErrors, formValidationErrors] = await Promise.all([
      !isEmpty(this.fieldLevelValidations) ? this.runFieldLevelValidations() : {},
      this.options.onValidate ? this.runFormLevelValidations() : {},
    ]);

    const combinedErrors = mergeDeep(fieldValidationErrors, formValidationErrors);

    runInAction(() => {
      this.API.errors = combinedErrors;

      this.updateErrorsForEveryField(combinedErrors);

      assign(this.API.formState, {
        isValid: isEmpty(combinedErrors),
        isValidating: false,
      });
    });

    return combinedErrors;
  };

  // wraps submit function passed as Form `onSubmit` prop after it's being passed to child render function
  protected submit: FormApi['submit'] = async (submitEvent) => {
    if (submitEvent) {
      submitEvent.persist();
      submitEvent.preventDefault();
    }

    runInAction(() => {
      assign(this.API.formState, {
        submitCount: this.API.formState.submitCount + 1,
        isSubmitting: true,
      });
    });

    await this.validate();

    const [nonObservableErrors, nonObservableValues] = toJSCompat([this.API.errors, this.API.values]);
    const isValid = isEmpty(nonObservableErrors);

    let error: unknown;
    let response: unknown;

    try {
      if (this.options.onSubmit) {
        response = await this.options.onSubmit({
          errors: nonObservableErrors!,
          values: nonObservableValues!,
          isValid,
          event: submitEvent,
        });
      }

      runInAction(() => {
        if (isEmpty(nonObservableErrors)) {
          this.updateInitialValues();
          this.updateFormIsDirtyBasedOnFields();
        }
        this.API.formState.isSubmitting = false;
      });
    } catch (e) {
      error = e;

      runInAction(() => {
        this.API.formState.isSubmitting = false;
      });
    }

    return {
      errors: nonObservableErrors!,
      values: nonObservableValues!,
      isValid,
      submitResult: {
        error,
        response,
      },
    };
  };
}

if (!isMobx6Used()) {
  decorateForMobx5(FormControllerClass, {
    fieldLevelValidations: observable.ref,
    API: observable,
    fields: observable,
  });
}

type This = FormControllerClass;
