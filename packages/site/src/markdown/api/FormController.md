# FormController

**type summary:**

```typescript
type Valid = null | undefined;
type Invalid = Omit<any, Valid>;
type FormValidationErrors = {[fieldName: string]: Invalid};
```

**Available props:**

| prop           | signature | description | 
| -------------- | --- | --- |
| onSubmit       | (errors: FormValidationErrors, values: FormValues, submitEvent?: React.FormEvent<any>) => void |
| initialValues? | FormValues | 
| onValidate?    | (values: any) => FormValidationErrors |
| onFormat?      | (values: FormValues) => FormValues | 
| onSubmitAfter? | (errors: FormValidationErrors, values: FormValues, submitEvent?: React.FormEvent<any>) => void; |

