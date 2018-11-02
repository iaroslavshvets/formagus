# FormController

## Available props:
<p class="category">Click on Type to see description</p>

| prop          | signature | description |
| ------------- | --- | --- |
| onSubmit      | (errors: [FormValidationErrors][FormValidationErrors], values: [FormValues][FormValues], submitEvent?: React.FormEvent<any>) => void |
| initialValues | [FormValues][FormValues] |
| onValidate    | (values: any) => [FormValidationErrors][FormValidationErrors] |
| onFormat      | [FormatterFunction][FormatterFunction] |
| onSubmitAfter | (errors: [FormValidationErrors][FormValidationErrors], values: [FormValues][FormValues], submitEvent?: React.FormEvent<any>) => void; |

`*` - **FormController** instance will have `API` field, which will have all of the [FormAPI][FormAPI] methods.

[FormatterFunction]: /api/FormController/types/FormatterFunction
[FormValidationErrors]: /api/FormController/types/FormValidationErrors
[FormValues]: /api/FormController/types/FormValues
[FormAPI]: /api/FormController/types/FormAPI
