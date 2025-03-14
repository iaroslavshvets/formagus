```typescript
interface FieldProps {
  formagus?: {
    name: string;
    meta: FieldMeta;
    value: any;
    onChange: (value: any) => void;
    onFocus: () => void;
    onBlur: () => void;
    validate: () => void;
  };
}
```

- [FieldMeta](./FieldMeta)
