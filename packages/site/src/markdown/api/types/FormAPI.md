```typescript
interface FormAPI {
  values: FormValues;
  errors: FormValidationErrors;
  submit: (submitEvent?: React.FormEvent<any>) => void;
  reset: () => void;
  clear: () => void;
  setFieldValue: (fieldName: string, value: any) => void;
  setFieldCustomState: (fieldName: string, key: string, value: any) => void;
  validate: () => void;
  getFieldMeta: (fieldName: string) => FieldMeta;
  meta: FormMeta;
}
```

- [FieldMeta](/api/Form/types/FieldMeta)
- [FormValidationErrors](/api/Form/types/FormValidationErrors)
- [FormValues](/api/Form/types/FormValues)
- [FormMeta](/api/Form/types/FormMeta)
