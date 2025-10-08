import {cleanup, render} from '@testing-library/react';
import React from 'react';
import {TestForm} from '../components/TestForm';
import {createTestFormDriver} from '../components/createTestFormDriver';
import {Field} from '../../index';
import {Input} from '../components/Input';

describe('Render', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render', () => {
    const wrapper = render(
      <TestForm>
        <Field
          name={TestForm.FIELD_ONE_NAME}
          render={(props) => {
            return <Input {...props} useHook={false} />;
          }}
        />
        <Field name={TestForm.FIELD_NESTED_NAME}>
          <Input />
        </Field>
      </TestForm>,
    ).container;

    const formDriver = createTestFormDriver({wrapper});

    expect(formDriver.getSerialized()).toMatchSnapshot();
  });
});
