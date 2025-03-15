import ReactDOM from 'react-dom';
import {observable, runInAction} from 'mobx';
import {observerBatching} from 'mobx-react-lite';
import {get, set} from 'lodash';
import {toJSCompat} from '../utils/toJSCompat';
import {type FieldProps, type OnValidateFunction} from '../Field/Field.types';
import {type FormAPI, type FormControllerOptions, type FormField, type Values} from './FormControllerClass.types';
import {isMobx6Used} from '../utils/isMobx6Used';
import {isEmpty} from '../utils/isEmpty';
import {mergeDeep} from '../utils/mergeDeep';

export class FormControllerClass {
  // Form options passed through form Props or directly through new Controller(options)
  protected options: FormControllerOptions;

  constructor(options: FormControllerOptions) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (observerBatching) {
      observerBatching(ReactDOM.unstable_batchedUpdates);
    }

    if (isMobx6Used()) {
      // require as import might not work in case of mobx@5 used during bundling in userland
      // eslint-disable-next-line @typescript-eslint/no-require-imports, no-undef,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      require('mobx').makeObservable(this, {
        fieldLevelValidations: observable.ref,
        fields: observable,
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

  protected safeApiValuesCopy: Record<string, unknown> = {};

  protected updateAPIValues = (fieldName?: string, value?: unknown) => {
    runInAction(() => {
      if (fieldName) {
        const safeValue = toJSCompat(value, false);
        const field = this.fields.get(fieldName);

        if (field?.fieldState.isMounted) {
          set(
            this.safeApiValuesCopy,
            fieldName,
            field.fieldProps?.onFormat ? field.fieldProps.onFormat(safeValue) : safeValue,
          );
        }
      } else {
        this.safeApiValuesCopy = {};

        this.fields.forEach((field, name) => {
          if (field.fieldState.isMounted) {
            const safeValue = toJSCompat(field.value, false);

            set(
              this.safeApiValuesCopy,
              name,
              field.fieldProps?.onFormat ? field.fieldProps.onFormat(safeValue) : safeValue,
            );
          }
        });
      }

      if (this.options.onFormat) {
        this.safeApiValuesCopy = this.options.onFormat(this.safeApiValuesCopy);
      }

      this.API.values = this.safeApiValuesCopy;
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

          field.fieldState.isDirty = !field.fieldState.onEqualityCheck(field.value, initialValue);
          field.fieldState.initialValue = initialValue;
        }
      });
    });
  };

  // executes general form validator passed to Form as a `onValidate` prop and returns errors
  protected runFormLevelValidations = () => {
    return this.options.onValidate ? this.options.onValidate(toJSCompat(this.API.values)) : {};
  };

  // executes all field level validators passed to Fields as a `onValidate` prop and returns errors
  protected runFieldLevelValidations = () => {
    return runInAction(() => {
      let pendingValidationCount = Object.keys(this.fieldLevelValidations).length;

      if (pendingValidationCount === 0) {
        return {};
      }

      const errors: Record<string, unknown> = {};

      return new Promise<typeof errors>((resolve) => {
        Object.keys(this.fieldLevelValidations).forEach((fieldName) => {
          const field = this.fields.get(fieldName)!;

          runInAction(() => {
            field.fieldState.isValidating = true;
          });

          void Promise.resolve(this.runFieldLevelValidation(fieldName)).then((error) => {
            if (error !== undefined && error !== null) {
              errors[fieldName] = error;
            }

            runInAction(() => {
              field.fieldState.isValidating = false;
            });

            pendingValidationCount -= 1;

            if (pendingValidationCount === 0) {
              resolve(errors);
            }
          });
        });
      });
    });
  };

  // all registered form fields, new field is being added when Field constructor is called
  fields = new Map<string, FormField>();

  protected setFieldErrors = (field: FormField, errors?: unknown) => {
    runInAction(() => {
      field.errors = errors;
    });
  };

  protected updateErrors = (params: {value: unknown} | {mutator: () => unknown}) => {
    runInAction(() => {
      if ('value' in params) {
        if (typeof params.value === 'object' && params.value !== null) {
          this.API.errors = params.value;
        } else {
          this.API.errors = {};
        }
      } else {
        params.mutator();
      }

      this.API.formState.isValid = Object.keys(this.API.errors).length === 0;
    });
  };

  // runs validation for particular field
  protected runFieldLevelValidation = (fieldName: string) => {
    return this.fieldLevelValidations[fieldName]?.(get(this.API.values, fieldName), this.API.values);
  };

  protected addVirtualField = (fieldName: string) => {
    runInAction(() => {
      const rawFieldProps = {
        errors: undefined,
        value: undefined,
        fieldProps: undefined,
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
        // eslint-disable-next-line @typescript-eslint/no-require-imports, no-undef,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
        const fieldProps = require('mobx').makeObservable(rawFieldProps, {
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

      const initialValue =
        get(this.options.initialValues, name) !== undefined
          ? get(this.options.initialValues, name)
          : props.defaultValue;

      field.fieldProps = {
        ...props,
        persist,
      };

      field.value = initialValue;

      field.fieldState.initialValue = initialValue;
      if (onEqualityCheck) {
        field.fieldState.onEqualityCheck = onEqualityCheck;
      }

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

      field.fieldState.isMounted = true;
      field.fieldState.isRegistered = true;

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
      if (field.fieldProps!.persist) {
        field.fieldState.isMounted = false;
      } else {
        this.fields.delete(name);
      }

      this.updateIsDirtyBasedOnFields();

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

  protected hasField = (fieldName: string) => {
    const field = this.fields.get(fieldName);
    return field?.fieldState.isMounted ?? false;
  };

  // form FormAPI, which will be passed to child render function or could be retrieved with API prop from controller
  API: FormAPI = {} as any;

  protected createFormApi = () => {
    runInAction(() => {
      this.API = {
        values: {},
        errors: {},
        submit: this.submit,
        hasField: this.hasField,
        reset: (values?: Values) => {
          // resets the form to initial values or custom if provided
          this.reset(values ?? this.options.initialValues ?? {});
        },
        setFieldValue: this.setFieldValue,
        validate: this.validate,
        validateField: this.validateField,
        getField: this.getField,
        getFields: this.getFields,
        formState: {
          isValidating: false,
          isSubmitting: false,
          submitCount: 0,
          isValid: true,
          isDirty: false,
          isTouched: false,
          isChanged: false,
        },
      };
    });
  };

  protected getField = (fieldName: string) => {
    return this.fields.get(fieldName);
  };

  protected getFields = () => {
    return [...this.fields.entries()].reduce<Record<string, FormField>>((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});
  };

  protected updateIsDirtyBasedOnFields = () => {
    runInAction(() => {
      const fields = [...this.fields.values()];
      this.API.formState.isDirty = fields.some((field) => field.fieldState.isMounted && field.fieldState.isDirty);
    });
  };

  protected updateIsChangedBasedOnFields = () => {
    runInAction(() => {
      const fields = [...this.fields.values()];
      this.API.formState.isChanged = fields.some((field) => field.fieldState.isMounted && field.fieldState.isChanged);
    });
  };

  // general handler for resetting form to specific state
  protected reset = (values: Values) => {
    runInAction(() => {
      this.fields.forEach((field, name) => {
        const newValue = get(values, name);
        const fieldName = field.fieldProps?.name;

        field.value = newValue;

        field.fieldState.isTouched = false;
        field.fieldState.isChanged = false;
        field.fieldState.isDirty = false;

        this.updateAPIValues(fieldName, newValue);
      });
      this.API.formState.isTouched = false;
      this.API.formState.isDirty = false;
      this.API.formState.isChanged = false;
      this.updateInitialValues(values);
      this.API.formState.submitCount = 0;
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
  protected setFieldValue: FormAPI['setFieldValue'] = (fieldName, value) => {
    runInAction(() => {
      this.createFieldIfDoesNotExist(fieldName);
      const field = this.fields.get(fieldName)!;

      field.value = value;

      field.fieldState.isChanged = true;
      field.fieldState.isDirty = !field.fieldState.onEqualityCheck(field.value, field.fieldState.initialValue);

      this.updateIsChangedBasedOnFields();
      this.updateIsDirtyBasedOnFields();

      this.updateAPIValues(fieldName, field.value);
    });
  };

  protected createFieldIfDoesNotExist = (fieldName: string) => {
    if (!this.fields.has(fieldName)) {
      this.addVirtualField(fieldName);
    }
  };

  // validates single field by calling field level validation, passed to Field as `validate` prop
  protected validateField: FormAPI['validateField'] = async (fieldName) => {
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

      this.updateErrors({
        mutator: () => {
          if (isEmpty(errors)) {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete this.API.errors[fieldName];
          } else {
            this.API.errors[fieldName] = errors;
          }
        },
      });

      if (field.fieldState.isMounted) {
        field.errors = errors;
      }

      this.API.formState.isValidating = false;
    });

    return errors;
  };

  // validates the form, by calling form level onValidate function combined with field level validations,
  // passed to Field as `onValidate` prop
  protected validate: FormAPI['validate'] = async () => {
    const hasFieldLevelValidations = Object.keys(this.fieldLevelValidations).length > 0;

    runInAction(() => {
      this.API.formState.isValidating = true;
    });

    const [fieldValidationErrors, formValidationErrors] = await Promise.all([
      hasFieldLevelValidations ? this.runFieldLevelValidations() : {},
      this.options.onValidate ? this.runFormLevelValidations() : {},
    ]);

    const combinedErrors = mergeDeep(fieldValidationErrors, formValidationErrors);

    runInAction(() => {
      this.updateErrors({value: combinedErrors});
      this.updateErrorsForEveryField(this.API.errors);
      this.API.formState.isValidating = false;
    });

    return combinedErrors;
  };

  // wraps submit function passed as Form `onSubmit` prop after it's being passed to child render function
  protected submit: FormAPI['submit'] = async (submitEvent) => {
    if (submitEvent) {
      submitEvent.persist();
      submitEvent.preventDefault();
    }

    runInAction(() => {
      this.API.formState.submitCount = this.API.formState.submitCount + 1;
      this.API.formState.isSubmitting = true;
    });

    await this.validate();

    const [errors, values] = toJSCompat([this.API.errors, this.API.values]);
    const isValid = isEmpty(errors);

    let error: unknown;
    let response: unknown;

    try {
      if (this.options.onSubmit) {
        response = await this.options.onSubmit({
          errors: errors!,
          values: values!,
          isValid,
          event: submitEvent,
        });
      }

      runInAction(() => {
        if (isEmpty(errors)) {
          this.updateInitialValues();
          this.updateIsDirtyBasedOnFields();
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
      errors: errors!,
      values: values!,
      isValid,
      submitResult: isValid
        ? ({
            isValid,
            response,
          } as const)
        : ({
            isValid,
            error: error as Error,
          } as const),
    };
  };
}

if (!isMobx6Used()) {
  // require as import might not work in case of mobx@6 used during bundling in userland
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-require-imports,@typescript-eslint/no-unsafe-call,no-undef
  require('mobx').decorate(FormControllerClass, {
    fieldLevelValidations: observable.ref,
    API: observable,
    fields: observable,
  });
}
