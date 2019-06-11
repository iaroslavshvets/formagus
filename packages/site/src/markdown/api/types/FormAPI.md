```typescript
interface FormAPI {
  values: FormValues;
  errors: FormValidationErrors;
  submit: (submitEvent?: React.FormEvent<any>) => void;
  reset: (values?: FormValues) => void;
  clear: () => void;
  setFieldValue: (fieldName: string, value: any) => void;
  setFieldCustomState: (fieldName: string, key: string, value: any) => void;
  validate: () => void;
  getFieldMeta: (fieldName: string) => FieldMeta;
  meta: FormMeta;
}
```

- [FieldMeta](/types/FieldMeta)
- [FormValidationErrors](/types/FormValidationErrors)
- [FormValues](/types/FormValues)
- [FormMeta](/types/FormMeta)
