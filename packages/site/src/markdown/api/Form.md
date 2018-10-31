# Form

## Available props:
<p class="category">look for type summary</p>

| prop          | signature | description |
| ------------- | --- | --- |
| onSubmit      | (errors: [FormValidationErrors](/api/Form/types/FormValidationErrors), values: [FormValues](/api/Form/types/FormValues), submitEvent?: React.FormEvent<any>) => void |
| initialValues | [FormValues](/api/Form/types/FormValues) |
| onValidate    | (values: any) => [FormValidationErrors](/api/Form/types/FormValidationErrors) |
| onFormat      | <T = Function>(values: [FormValues](/api/Form/types/FormValues)) =>  {[P in keyof [FormValues](/api/Form/types/FormValues)]: T[[FormValues](/api/Form/types/FormValues)[P]]} |
| onSubmitAfter | (errors: [FormValidationErrors](/api/Form/types/FormValidationErrors), values: [FormValues](/api/Form/types/FormValues), submitEvent?: React.FormEvent<any>) => void |
| children      | (renderProps: [FormAPI](/api/Form/types/FormAPI)) => JSX.Element |
| controller * | `FormController`|


`*` - **controller** prop should be passed (instance of controller created manually before) OR any other props, but not both.
