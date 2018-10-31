```typescript
interface FieldMeta {
  custom: {[key: string]: any};
  onEqualityCheck: EqualityCheckFunction;
  initialValue: any;
  isTouched: boolean;
  isActive: boolean;
  isValidating: boolean;
  isDirty: boolean;
  isRegistered: boolean;
}
```

- [EqualityCheckFunction](/api/Form/types/EqualityCheckFunction)
