import React from 'react';
import type {FormAPI, FormControllerOptions} from '../../src/FormController/FormController.types';
import {Field, Form} from '../../src';
import {Input} from './Input';

export class TestForm extends React.Component<FormControllerOptions & {controller?: any}> {
  static FIELD_ONE_NAME = 'field_one_name';

  static FIELD_TWO_NAME = 'field_two_name';

  static FIELD_THREE_NAME = 'field_three_name';

  render() {
    const {controller, children, ...formProps} = this.props;
    const props = controller ? {controller} : formProps;

    return (
      <Form {...props}>
        {(formApi: FormAPI) => {
          const {submit, values} = formApi;

          return (
            <form onSubmit={submit} noValidate data-hook="test-form">
              {children || (
                <div>
                  <Field name={TestForm.FIELD_ONE_NAME}>
                    <Input />
                  </Field>
                  <Field name={TestForm.FIELD_TWO_NAME}>
                    <Input />
                  </Field>
                </div>
              )}

              <div data-hook="form-values">{JSON.stringify(values)}</div>

              <button type="submit">Submit</button>
            </form>
          );
        }}
      </Form>
    );
  }
}
