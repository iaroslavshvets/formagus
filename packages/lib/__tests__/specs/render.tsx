import {cleanup, render} from '@testing-library/react';
import React from 'react';
import {TestForm} from '../components/TestForm';
import {createTestFormDriver} from '../components/TestForm.driver';
import {Field} from '../../src';
import {InputAdapter} from '../components/InputAdapter';

describe('Render', () => {
  afterEach(() => cleanup());

  it('should render', () => {
    const wrapper = render(
      <TestForm>
        <Field name={TestForm.FIELD_ONE_NAME} adapter={InputAdapter} />
        <Field
          name={TestForm.FIELD_TWO_NAME}
          render={(props) => {
            return <InputAdapter {...props} useHook={false} />;
          }}
        />
        <Field name={TestForm.FIELD_THREE_NAME}>
          <InputAdapter />
        </Field>
      </TestForm>,
    ).container;
    const formDriver = createTestFormDriver({wrapper});

    expect(formDriver.get.serialized()).toMatchSnapshot();
  });
});
