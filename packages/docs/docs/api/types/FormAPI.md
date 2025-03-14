```typescript
interface FormAPI {
  values: FormValues;
  errors: FormValidationErrors;
  submit: (submitEvent?: React.FormEvent<any>) => void;
  reset: () => void;
  resetToValues: (values?: FormValues) => void;
  clear: () => void;
  setFieldValue: (fieldName: string, value: any) => void;
  validate: () => void;
  getFieldMeta: (fieldName: string) => FieldMeta;
  meta: FormMeta;
}
```

- [FieldMeta](./FieldMeta)
- [FormValidationErrors](./FormValidationErrors)
- [FormValues](./FormValues)
- [FormMeta](./FormMeta)
