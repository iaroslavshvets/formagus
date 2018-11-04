```typescript
interface FieldProps {
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
```

- [FieldMeta](/types/FieldMeta)
