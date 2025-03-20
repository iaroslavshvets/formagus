```typescript
export type Valid = null | undefined;
export type Invalid = any;
export type FieldValidationState = Valid | Invalid;

export type OnValidateFunction =
  | ((value: any, values?: any) => FieldValidationState)
  | ((value: any, values?: any) => Promise<FieldValidationState>);
```
