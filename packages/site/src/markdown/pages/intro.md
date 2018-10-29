# Introduction

Yo! This library will become your real bro, while working on the forms. It will handle all
the nasty stuff, like different form and field states (dirty, touched, submit count, up to date values, errors and bla-bla-bla). But you will need to help out
your bro to carry out this mission, by providing adapters, which are responsible for the displaying your actual components. Together
you will become a real team.

Formagus is compatible with React 15+ and is powered by `Mobx`.

## Features

* component centric approach
* is powered by Mobx and highly optimized, so it has great performance (it's as fast as Mobx is),
* You can use your own validations of any kind (eventually most of forms end up with home-baked validation),
* support for field and form level validations(sync and async works)
* programatical way to interact with the form, from any place in code
* simple, yet powerful form API, which allows you to model any form interactions
* written in typescript
* own adapters allow you easily use ANY 3rd-party components or write your own, whatever you like - you the boss!

## Basic concept

`<Form/>` injects all available props to your component by passing them to its child render function.
If you will render `<Field/>` component with `name` prop (supports nesting like `name="someProps.nestedProp"`, and change the value to
`nestedPropValue` will result into having form values like `{someProps: {nestedProps: nestedPropValue}}`. `<Field/>` also
have to receive `adapter` property, or `child render function`, which will render actual input or whatever element you want.
`<Field/>` injects all available props to the adapter in any case.

## Step by step guide

Form without any blows and whistles looks like this:

```jsx
const SimpleAsHellForm = (props) => (
  <form onSubmit={props.onSubmit}>
    <input name="form_field_1" />
    <button type="submit">Submit</button>
  </form>
)
```

Now lets add the library sugar into the mix:

```jsx
import {Form} from '@wix/magus-form';

const Formagus = (props) => (
  <Form onSubmit={props.onSubmit}>
    {(submit) => {
      return (
       <form onSubmit={submit}>
          <input name="form_field_1" />
          <button type="submit">Submit</button>
       </form>
      )
    }}
  </Form>
)
```

Hm... Looks legit. But. It will not work. We missing the crucial player in the game – Mr. `Field`, which is the bridge
between Formagus and your components. In order to set it up, you need to pass an Adapter.
Adapter – is a component, which will receive all available form properties as `props.Formagus`, which
are injected by the `<Field/>`. Now, back to school:

```jsx
import {Form, Field} from '@wix/magus-form';

const InputAdapter = (props) => {
  const {Formagus} = props;
  return (
    <input
      value={Formagus.value}
      onChange={(e) => {
        Formagus.onChange(e.target.value);
      }}
    />
  )
}

const Formagus = (props) => (
  <Form onSubmit={props.onSubmit}>
    {(submit) => {
      return (
       <form onSubmit={submit}>
          <Field name="form_field_1" adapter={InputAdapter}>
          <button type="submit">Submit</button>
       </form>
      )
    }}
  </Form>
)
```

Much better, now everything works. So, as you see, basic usage is pretty simple.

## Advanced usage

There are cases, when you need to interact with the form programatically. `FormController` here to the rescue.

1. in any place in the code

```jsx
import {FormController} from '@wix/magus-form';

const formController = new FormController({
  onSubmit: (errors, values) => {
    if (errors === null) {
      console.log(`Submitted values: ${values}`);
    } else {
      console.error(`Oops. Got some errors: ${errors}`);
    }
  }
});

export {formController}
```

2. later in React Component file

```jsx
import {Form, Field} from '@wix/magus-form';
import {formController} from './formController';
import {InputAdapter} from './InputAdapter';

const Formagus = (props) => (
  <Form controller={formController}>
    {(submit) => {
      return (
       <form onSubmit={submit}>
          <Field name="form_field_1" adapter={InputAdapter}>
          <button type="submit">Submit</button>
       </form>
      )
    }}
  </Form>
)
```
`FormController` receives the very same options, which can be passed to `Form` directly. If one passes `controller` prop,
then no other props should be passed to the `Form` and all the options should be passed to the created form controller instance.


