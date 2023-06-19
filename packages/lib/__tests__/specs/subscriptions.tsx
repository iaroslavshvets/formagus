import {act, cleanup, render} from '@testing-library/react';
import React from 'react';
import {reaction} from 'mobx';
import {TestForm} from '../components/TestForm';
import {Input} from '../components/Input';
import {createFormController, Field} from '../../src';
import {createTestFormDriver} from '../components/createTestFormDriver';
import {eventually} from '../helpers/eventually';

describe('Subscriptions', () => {
  afterEach(() => cleanup());

  it('onSubmit reaction', async () => {
    const controller = createFormController({
      onSubmit: jest.fn(),
      onValidate: jest.fn(),
    });

    let submitStartTime = 0;
    let submitTimeTotal = 0;

    const unsubscribe = reaction(
      () => controller.API.meta.isSubmitting,
      (isSubmitting) => {
        if (isSubmitting) {
          submitStartTime = Date.now();
        } else {
          submitTimeTotal = Date.now() - submitStartTime;
        }
      },
    );

    const wrapper = await render(
      <TestForm controller={controller}>
        <Field name={TestForm.FIELD_ONE_NAME}>
          <Input />
        </Field>
      </TestForm>,
    ).container;

    const formDriver = createTestFormDriver({wrapper});

    await act(() => formDriver.when.submit());

    await eventually(() => {
      expect(submitTimeTotal).toBeGreaterThanOrEqual(1);

      unsubscribe();
    });
  });
});
