# Form

## Available props:
<p class="category">Click on Type to see description in Popup</p>

| prop          | signature                                        | description |
| ------------- |--------------------------------------------------| --- |
| onSubmit      | (params: SubmitParams) => any                    |
| initialValues | [Values][Values]                                 |
| onValidate    | (values: Values) => Promise\<any\>               |
| onFormat      | [FormatterFunction][FormatterFunction]           |
| children      | (renderProps: [FormAPI][FormAPI]) => JSX.Element |
| controller * | [FormController][FormController]                 |

`*` - **controller** prop should be passed (instance of controller created manually before) OR any other props, but not both.

[FormatterFunction]: ./types/OnFormatFunction
[Errors]: ./types/Errors
[Values]: ./types/Values
[FormAPI]: ./types/FormAPI
[FormController]: /api/FormController
