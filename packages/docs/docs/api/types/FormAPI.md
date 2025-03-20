```typescript
interface FormAPI {
  values: Values;
  errors: Errors;
  formState: FormState;
  submit: <T extends HTMLElement>(
    submitEvent?: React.FormEvent<T>,
  ) => Promise<
    Omit<SubmitParams<T>, 'event'> & {
      submitResult:
        | {
            isValid: true;
            response: any;
          }
        | {
            isValid: false;
            error: Error;
          };
    }
  >;
  reset: (values?: Values) => void;
  validate: () => any;
  hasField: (fieldName: string) => boolean;
  getField: (fieldName: string) => FormField | undefined;
  validateField: (fieldName: string) => any;
  setFieldValue: (fieldName: string, value: any) => void;
  getFields: () => Record<string, FormField>;
}
```

- [FieldState](./FieldState)
- [Errors](./Errors)
- [Values](./Values)
- [FormState](./FormState)
