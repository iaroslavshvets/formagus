# FormController

## Available props:
<p class="category">Click on Type to see description in Popup</p>

| prop           | signature | description |
|----------------| --- | --- |
| onSubmit       | (errors: [FormValidationErrors][FormValidationErrors], values: [FormValues][FormValues], submitEvent?: React.FormEvent<any>) => void |
| initialValues  | [FormValues][FormValues] |
| onValidate     | (values: any) => [FormValidationErrors][FormValidationErrors] |
| onFormat       | [FormatterFunction][FormatterFunction] |
| onSubmitBefore | (submitEvent?: React.FormEvent<any>) => void; |
| onSubmitAfter  | (errors: [FormValidationErrors][FormValidationErrors], values: [FormValues][FormValues], submitEvent?: React.FormEvent<any>) => void; |

`*` - **FormController** instance will have `API` field, which will have all of the [FormAPI][FormAPI] methods.

[FormatterFunction]: /types/FormatterFunction
[FormValidationErrors]: /types/FormValidationErrors
[FormValues]: /types/FormValues
[FormAPI]: /types/FormAPI
