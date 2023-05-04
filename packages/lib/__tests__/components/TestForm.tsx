import React from 'react';
import type {FormAPI, FormControllerOptions} from '../../src/FormControllerClass/FormControllerClass.types';
import {Field, Form, FormController} from '../../src';
import {Input} from './Input';

export const TestForm = (
  props: FormControllerOptions & {
    // eslint-disable-next-line react/require-default-props
    controller?: FormController;
    // eslint-disable-next-line react/require-default-props
    children?: React.ReactNode;
  },
) => {
  const {controller, children, ...formProps} = props;

  return (
    <Form {...(controller ? {controller} : formProps)}>
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
};

TestForm.FIELD_ONE_NAME = 'field_one_name';
TestForm.FIELD_TWO_NAME = 'field_two_name';
TestForm.FIELD_NESTED_NAME = 'root.field.nested';
