```typescript
type Valid = null | undefined;
type Invalid = Omit<any, Valid>;
type FormValidationErrors = {[fieldName: string]: Invalid};
```
