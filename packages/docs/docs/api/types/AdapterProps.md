```typescript
export interface AdapterProps {
  formagus: {
    name: string;
    fieldState: FieldState;
    value: any;
    formAPI: FormAPI;
    onChange: (value: any) => void;
    onFocus: () => void;
    onBlur: () => void;
    validate: () => void;
  };
}
```

- [FieldState](./FieldState)
- [FormAPI](./FormAPI)
