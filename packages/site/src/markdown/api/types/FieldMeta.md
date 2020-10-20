```typescript
interface FieldMeta {
  errors: any | null;
  isDirty: boolean;
  isTouched: boolean;
  isChanged: boolean;
  isActive: boolean;
  isValidating: boolean;
  isRegistered: boolean;
  customState: {[key: string]: any};
  form: FormMeta;
}
```

- [FormMeta](/types/FormMeta)
