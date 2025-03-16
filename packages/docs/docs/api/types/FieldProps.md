```typescript
interface FieldProps<T = any> {
  name: string;
  defaultValue?: T;
  onValidate?: OnValidateFunction<T>;
  onFormat?: OnFormatFunction<T>;
  onEqualityCheck?: OnEqualityCheckFunction<T>;
  onInit?: (API: FieldApi) => void;
  persist?: boolean;
  controller?: FormController;
  children?: ReactNode;
  render?: (injectedFieldDisplayProps: FieldRenderProps<T>) => ReactNode;
}
```

- [FieldState](./FieldState)
- [OnValidateFunction](./OnValidateFunction)
- [OnFormatFunction](./OnFormatFunction)
- [OnEqualityCheckFunction](./OnEqualityCheckFunction)
- [FieldApi](./FieldApi)
- [FieldRenderProps](./FieldRenderProps)
