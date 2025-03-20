```typescript
export type FormField = Omit<FieldApi, 'name'> & {name?: string} & {
  fieldState: FieldState & {
    isRegistered: boolean;
  };
};
```

- [FieldApi](./FieldApi)
- [FieldState](./FieldState)