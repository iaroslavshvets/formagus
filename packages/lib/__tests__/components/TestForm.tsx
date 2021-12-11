import React from 'react';
import {Form} from '../../src/';
import type {FormAPI, FormControllerOptions} from '../../src/FormController';
import {InputField} from './InputField';

export class TestForm extends React.Component<FormControllerOptions & {controller?: any}> {
  static FIELD_ONE_NAME = 'field_one_name';
  static FIELD_TWO_NAME = 'field_two_name';

  render() {
    const {controller, ...formProps} = this.props;
    const props = controller ? {controller} : formProps;

    return (
      <Form {...props}>
        {(formApi: FormAPI) => {
          const {submit, values} = formApi;

          return (
            <form onSubmit={submit} noValidate data-hook="test-form">
              {this.props.children ? (
                this.props.children
              ) : (
                <div>
                  <InputField name={TestForm.FIELD_ONE_NAME} />
                  <InputField name={TestForm.FIELD_TWO_NAME} />
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
