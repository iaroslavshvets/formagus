# FormController

## Available props:
<p class="category">Click on Type to see description in Popup</p>

| prop          | signature                              | description |
| ------------- |----------------------------------------| --- |
| onSubmit      | (params: SubmitParams) => any          |
| initialValues | [Values][Values]                       |
| onValidate    | (values: Values) => Promise\<any\>     |
| onFormat      | [FormatterFunction][FormatterFunction] |

`*` - **FormController** instance will have `API` field, which will have all of the [FormAPI][FormAPI] methods.

[FormatterFunction]: ./types/OnFormatFunction
[Errors]: ./types/Errors
[Values]: ./types/Values
[FormAPI]: ./types/FormAPI
