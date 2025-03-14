```typescript
export interface AdapterProps {
  formagus: {
    name: string;
    meta: FieldMeta;
    value: any;
    formAPI: FormAPI;
    onChange: (value: any) => void;
    onFocus: () => void;
    onBlur: () => void;
    validate: () => void;
  };
}
```

- [FieldMeta](./FieldMeta)
- [FormAPI](./FormAPI)
