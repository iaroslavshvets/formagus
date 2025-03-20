```typescript
type Valid = null | undefined;
type Invalid = Omit<any, Valid>;
type Errors = {[fieldName: string]: Invalid} | null;
```
