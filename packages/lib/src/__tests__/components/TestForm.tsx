import React, {type ReactNode} from 'react';
import {type FormApi, type FormControllerOptions} from '../../FormControllerClass/FormControllerClass.types';
import {Field, Form, type FormController} from '../../index';
import {Input} from './Input';

export const TestForm = (
  props: FormControllerOptions & {
    controller?: FormController;
    children?: ReactNode;
  },
) => {
  const {controller, children, ...formProps} = props;

  return (
    <Form {...(controller ? {controller} : formProps)}>
      {(formApi: FormApi) => {
        const {submit, values} = formApi;

        return (
          <form
            onSubmit={(e) => {
              void submit(e);
            }}
            noValidate={true}
            data-hook="test-form"
          >
            {children ?? (
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

TestForm.FIELD_ONE_NAME = 'field_one_name' as const;
TestForm.FIELD_TWO_NAME = 'field_two_name' as const;
TestForm.FIELD_NESTED_NAME = 'root.field.nested' as const;
