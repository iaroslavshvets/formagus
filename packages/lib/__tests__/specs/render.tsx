import {cleanup, render} from '@testing-library/react';
import React from 'react';
import {TestForm} from '../components/TestForm';
import {createTestFormDriver} from '../components/TestForm.driver';
import {InputAdapter} from '../components/InputAdapter';
import {Field} from '../../src';

test('Render', () => {
  afterEach(() => {
    return cleanup();
  });

  const wrapper = render(
    <TestForm>
      <Field name={TestForm.FIELD_ONE_NAME} adapter={InputAdapter} />
      <Field name={TestForm.FIELD_TWO_NAME}>
        {(props) => {
          return <InputAdapter {...props} />;
        }}
      </Field>
    </TestForm>,
  ).container;
  const formDriver = createTestFormDriver({wrapper});

  expect(formDriver.get.serialized()).toMatchSnapshot();
});
