# FormController

## Available props:
<p class="category">Click on Type to see description in Popup</p>

| prop          | signature                                                                                                                              | description |
| ------------- |----------------------------------------------------------------------------------------------------------------------------------------| --- |
| onSubmit      | (errors: [Errors][Errors], values: [Values][Values], submitEvent?: React.FormEvent\<any\>) => void |
| initialValues | [Values][Values]                                                                                                               |
| onValidate    | (values: any) => [Errors][Errors]                                                                          |
| onFormat      | [FormatterFunction][FormatterFunction]                                                                                                 |
| onSubmitAfter | (errors: [Errors][Errors], values: [Values][Values], submitEvent?: React.FormEvent\<any\>) => void |

`*` - **FormController** instance will have `API` field, which will have all of the [FormAPI][FormAPI] methods.

[FormatterFunction]: ./types/FormatterFunction
[Errors]: ./types/Errors
[Values]: ./types/Values
[FormAPI]: ./types/FormAPI
