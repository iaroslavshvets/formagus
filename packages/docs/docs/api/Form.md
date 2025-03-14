# Form

## Available props:
<p class="category">Click on Type to see description in Popup</p>

| prop          | signature                                                                                                                              | description |
| ------------- |----------------------------------------------------------------------------------------------------------------------------------------| --- |
| onSubmit      | (errors: [Errors][Errors], values: [Values][Values], submitEvent?: React.FormEvent\<any\>) => void |
| initialValues | [Values][Values]                                                                                                               |
| onValidate    | (values: any) => [Errors][Errors]                                                                          |
| onFormat      | [FormatterFunction][FormatterFunction]                                                                                                 |
| onSubmitAfter | (errors: [Errors][Errors], values: [Values][Values], submitEvent?: React.FormEvent\<any\>) => void |
| children      | (renderProps: [FormAPI][FormAPI]) => JSX.Element                                                                                       |
| controller * | [FormController][FormController]                                                                                                       |


`*` - **controller** prop should be passed (instance of controller created manually before) OR any other props, but not both.

[FormatterFunction]: ./types/FormatterFunction
[Errors]: ./types/Errors
[Values]: ./types/Values
[FormAPI]: ./types/FormAPI
[FormController]: /api/FormController
