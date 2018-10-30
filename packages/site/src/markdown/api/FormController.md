# FormController

## Available props:
<p class="category">look for type summary</p>

| prop          | signature | description |
| ------------- | --- | --- |
| onSubmit      | (errors: `FormValidationErrors`, values: `FormValues`, submitEvent?: React.FormEvent<any>) => void |
| initialValues | `FormValues` |
| onValidate    | (values: any) => `FormValidationErrors` |
| onFormat      | <T = Function>(values: `FormValues`) =>  {[P in keyof `FormValues`]: T[`FormValues`[P]]} |
| onSubmitAfter | (errors: `FormValidationErrors`, values: `FormValues`, submitEvent?: React.FormEvent<any>) => void; |


**type summary:**

```typescript
type FormValues = {
  [key: string]: any | FormValues;
};

type Valid = null | undefined;
type Invalid = Omit<any, Valid>;
type FormValidationErrors = {[fieldName: string]: Invalid};
```
