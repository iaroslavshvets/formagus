import * as React from 'react';
import {Field} from '../../src/Field';
import {Form} from '../../src/Form';
import {FormAPI, FormControllerOptions} from '../../src/FormController';
import {InputAdapter} from './InputAdapter';

export interface TestFormProps extends FormControllerOptions {
  controller?: any;
}

export class TestForm extends React.Component<TestFormProps> {
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
                  <Field name={TestForm.FIELD_ONE_NAME} adapter={InputAdapter} />
                  <Field name={TestForm.FIELD_TWO_NAME} adapter={InputAdapter} />
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
