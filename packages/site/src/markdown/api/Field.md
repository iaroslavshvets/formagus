# Field

## Available props:
<p class="category">look for type summary</p>

| prop            | signature | description |
| --------------- | --- | --- |
| name            | string |
| children        | (injectedAdapterProps: AdapterProps) => JSX.Element |
| adapter         | `FieldAdapter` |
| defaultValue    | any |
| onValidate      | `ValidationFunction` |
| onFormat        | `FormatterFunction` |
| onEqualityCheck | `EqualityCheckFunction` |
| onInit          | Function |
| persist         | boolean |
| adapterProps    | any |

**type summary:**

```typescript
export type Valid = null | undefined;
export type Invalid = any;
export type FieldValidationState = Valid | Invalid;

export type ValidationFunction =
  | ((value: any, values?: any) => FieldValidationState)
  | ((value: any, values?: any) => Promise<FieldValidationState>);

interface FormMeta {
  isValidating: boolean;
  isSubmitting: boolean;
  submitCount: number;
  isValid: boolean;
  isDirty: boolean;
  isTouched: boolean;
}

interface FieldMeta {
  errors: FieldValidationState;
  isDirty: boolean;
  isTouched: boolean;
  isActive: boolean;
  isValidating: boolean;
  isRegistered: boolean;
  custom: {[key: string]: any};
  form: FormMeta;
}

interface AdapterProps {
  formagus?: {
    name: string;
    meta: FieldMeta;
    value: any;
    setCustomState: (key: string, value: any) => void;
    onChange: (value: any) => void;
    onFocus: () => void;
    onBlur: () => void;
    validate: () => void;
  };
}

type EqualityCheckFunction = (newValue: any, oldValue: any) => boolean

type FormatterFunction = <T = Function>(values: FormValues) =>  {[P in keyof FormValues]: T[FormValues[P]]} |
```
