# Form

## Available props:
<p class="category">Click on Type to see description in Popup</p>

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

[FormatterFunction]: /types/FormatterFunction
[FormValidationErrors]: /types/FormValidationErrors
[FormValues]: /types/FormValues
[FormAPI]: /types/FormAPI
[FormController]: /api/FormController
