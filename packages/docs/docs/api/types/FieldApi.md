```typescript
interface FieldApi<T = any> {
  name: string;
  fieldState: FieldState;
  value: T;
  errors: any;
  onChange: (value: any) => void;
  onFocus: () => void;
  onBlur: () => void;
  validate: () => Promise<any>;
  validateField: () => Promise<any>;
  fieldProps: FieldProps<T>;
}
```

- [FieldState](./FieldState)
- [FieldProps](./FieldProps)