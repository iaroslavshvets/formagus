```typescript
export interface AdapterProps {
  formagus: {
    name: string;
    meta: FieldMeta;
    value: any;
    setCustomState: (key: string, value: any) => void;
    formAPI: FormAPI;
    onChange: (value: any) => void;
    onFocus: () => void;
    onBlur: () => void;
    validate: () => void;
  };
}
```

- [FieldMeta](/types/FieldMeta)
- [FormAPI](/types/FormAPI)
