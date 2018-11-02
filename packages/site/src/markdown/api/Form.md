# Form

## Available props:
<p class="category">Click on Type to see description</p>

| prop          | signature | description |
| ------------- | --- | --- |
| onSubmit      | (errors: [FormValidationErrors][FormValidationErrors], values: [FormValues][FormValues], submitEvent?: React.FormEvent<any>) => void |
| initialValues | [FormValues][FormValues] |
| onValidate    | (values: any) => [FormValidationErrors][FormValidationErrors] |
| onFormat      | [FormatterFunction][FormatterFunction] |
| onSubmitAfter | (errors: [FormValidationErrors][FormValidationErrors], values: [FormValues][FormValues], submitEvent?: React.FormEvent<any>) => void |
| children      | (renderProps: [FormAPI][FormAPI]) => JSX.Element |
| controller * | [FormController][FormController]|


`*` - **controller** prop should be passed (instance of controller created manually before) OR any other props, but not both.

[FormatterFunction]: /api/Field/types/FormatterFunction
[FormValidationErrors]: /api/Form/types/FormValidationErrors
[FormValues]: /api/Form/types/FormValues
[FormAPI]: /api/Form/types/FormAPI
[FormController]: /api/FormController
