# Introduction

Formagus adds some necessary magic, while working on the forms. That kind, that allows easily handle all
the nasty stuff, like different form and field states (dirty, touched, submit count, up to date values, errors and so on). Magic is good, too much of it and it easily becomes
a noose over your neck, binding your to the structure chosen by library and not you. So to balance the scales you need to provide adapters, which are responsible for the displaying of form state.
Formagus doesn't have any adapters by default, but you can find some examples in /examples section.

Formagus is compatible with React 15+ and is powered by `Mobx`.

## What differs from other form libraries

* React way of structuring app, forms are made of dynamic elements.
 It was rendered - it becomes a part of form state and vice versa.
* is powered by Mobx and highly optimized, so it has great performance,
* You can use your own validation of any kind (eventually a lot of forms end up with home-baked solution well tailored for specific needs),
* support for field and form level validations (sync and async works out of the box)
* Imperative way to interact with the form, from any place in code, by creating new instance of form controller and then
 passing it as a prop
* simple, yet powerful form API, which allows you to model any form interactions (mobx `reaction`, `autorun`, etc.)
* written in typescript, fully typed
* own adapters allow you easily use `ANY` 3rd-party components or write your own, basically there is not difference in usage, you choose - you the boss!

## Basic concept

`<Form/>` injects all available props to your component by passing them to its child render function.
When you render `<Field/>` component with `name` prop (supports nesting like `name="someProps.nestedProp"`, and change the value to
`nestedPropValue` will result into having form values like `{someProps: {nestedProps: nestedPropValue}}`. `<Field/>` also
have to receive `adapter` property, or `child render function`, which will render actual `<input />` or whatever element you want.
`<Field/>` injects form and it's own state to the adapter in any case, passing it as a prop.

## Step by step guide

Form without any blows and whistles looks like this:

```jsx
const onSubmit = ...implement me;

const SimpleAsHellForm = () => (
  <form onSubmit={onSubmit}>
    <input name="form_field_1" />
    <button type="submit">Submit</button>
  </form>
)
```

Now lets add the Formagus into the mix:

```jsx
import {Form} from '@wix/formagus';

const onSubmit = (errors, values) => {
    if (errors === null) {
        fetch('www.endpoint.com', {
            method: 'POST',
            body: JSON.stringify(values),
        })
    }
};

const Formagus = () => (
  <Form onSubmit={onSubmit}>
    {({submit}) => {
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
Adapter – is a component, which will receive all available state as `props.formagus`, which
are injected by the `<Field/>`. Now, back to school:

```jsx
import {Form, Field} from '@wix/formagus';

const InputAdapter = (props) => {
  const {formagus} = props;
  return (
    <input
      value={formagus.value}
      onChange={(e) => {
        formagus.onChange(e.target.value);
      }}
    />
  )
}

const Formagus = (props) => (
  <Form onSubmit={props.onSubmit}>
    {({submit}) => {
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

There are cases, when you need to interact with the form from outside of it. `FormController` hurries to the rescue.

1. in any place in the code

```jsx
import {FormController} from '@wix/formagus';

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
import * as React from 'react';
import {Form, Field} from '@wix/formagus';
import {formController} from './formController';
import {InputAdapter} from './InputAdapter';

const Formagus = (props) => (
  <Form controller={formController}>
    {({submit}) => {
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

## How it all works:

### Sample form
```tsx
<Form>
	{() => {
		<Field name="formagus_user" adapter={YourInputAdapter} />
	}}
</Form>
```
### Basic flow
```mermaid
graph TD
A(FORM render)
A -->| render //FIELD | B(FIELD is returning null)
B -->|ComponentDidMount //FIELD| C(FIELD registers itself in FormController)
C --> |render // FIELD receives data (FieldMeta) from Controller| D(FIELD renders props.adapter and passing data as formagus prop)
D --> |render // YourInputAdapter | E(Visible component is being rendered)``
```


