```typescript
type FormatterFunction = <T = Function>(values: FormValues) => 
 {[P in keyof FormValues]: T[FormValues[P]]}
```

- [FormValues](/types/FormValues)
