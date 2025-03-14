```typescript
interface FieldProps {
  formagus?: {
    name: string;
    fieldState: FieldState;
    value: any;
    onChange: (value: any) => void;
    onFocus: () => void;
    onBlur: () => void;
    validate: () => void;
  };
}
```

- [FieldState](./FieldState)
