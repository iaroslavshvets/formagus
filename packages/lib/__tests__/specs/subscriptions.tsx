import {cleanup, render} from '@testing-library/react';
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
    const submitTimeLogger = jest.fn();

    const controller = createFormController({
      onSubmit: jest.fn(),
      onValidate: jest.fn(),
    });

    let submitTimeCounter = 0;

    const unsubscribe = reaction(
      () => controller.API.meta.isSubmitting,
      (isSubmitting) => {
        if (isSubmitting) {
          submitTimeCounter = Date.now();
        } else {
          submitTimeLogger(Date.now() - submitTimeCounter);
        }
      },
    );

    const wrapper = render(
      <TestForm controller={controller}>
        <Field name={TestForm.FIELD_ONE_NAME}>
          <Input />
        </Field>
      </TestForm>,
    ).container;

    const formDriver = createTestFormDriver({wrapper});

    formDriver.when.submit();

    await eventually(() => {
      const submitTime = submitTimeLogger.mock.calls[0][0];

      expect(submitTime).toBeGreaterThanOrEqual(1);

      unsubscribe();
    });
  });
});
