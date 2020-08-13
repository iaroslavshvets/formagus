import {cleanup, render} from '@testing-library/react';
import React from 'react';
import {TestForm} from '../components/TestForm';
import {InputAdapter} from '../components/InputAdapter';
import {Field} from '../../src';
import {createTestFormDriver} from '../components/TestForm.driver';
import {createInputAdapterDriver} from '../components/InputAdapter/InputAdapter.driver';
import {waitFor} from '../helpers/conditions';

describe('Form props', () => {
  afterEach(() => {
    return cleanup();
  });

  it('initialValues', async () => {
    const wrapper = render(
      <TestForm
        initialValues={{
          [TestForm.FIELD_ONE_NAME]: 'John Snow',
        }}
      />,
    ).container;
    const fieldDriver = createInputAdapterDriver({wrapper, dataHook: TestForm.FIELD_ONE_NAME});

    expect(fieldDriver.get.value()).toBe('John Snow');
  });

  it('onSubmitAfter', async () => {
    const callbackStack: string[] = [];

    const wrapper = render(
      <TestForm
        initialValues={{
          [TestForm.FIELD_ONE_NAME]: 'John Snow',
        }}
        onSubmit={() => callbackStack.push('onSubmit')}
        onSubmitAfter={() => callbackStack.push('onSubmitAfter')}
      />,
    ).container;

    const formDriver = createTestFormDriver({wrapper});
    formDriver.when.submit();

    await waitFor(wrapper)(() => {
      const [firstCall, secondCall] = callbackStack;
      return firstCall === 'onSubmit' && secondCall === 'onSubmitAfter';
    });
  });


  it('formatter (with field and arrays support)', async () => {
    const FIELD_ONE_NAME = 'array[0].field_one_name';
    const FIELD_TWO_NAME = 'array[0].field_two_name';

    const onValidate = jest.fn();
    const wrapper = render(
      <TestForm
        initialValues={{
          array: [
            {
              field_one_name: 'John Snow',
              field_two_name: 'Ned Stark'
            }
          ]
        }}
        onValidate={onValidate}
        onFormat={(values: any) => {
          const formattedValues = {...values};

          if (formattedValues.array) {
            formattedValues.array[0].field_one_name = formattedValues.array[0].field_one_name + ':formatted';
          }

          return formattedValues;
        }}
      >
        <Field name={FIELD_ONE_NAME} adapter={InputAdapter} />
        <Field
          name={FIELD_TWO_NAME}
          adapter={InputAdapter}
          onFormat={(value: string) => {
            return value + ':formatted';
          }}
        />
      </TestForm>,
    ).container;

    const formDriver = createTestFormDriver({wrapper});
    const fieldOneDriver = createInputAdapterDriver({wrapper, dataHook: FIELD_ONE_NAME});
    const fieldTwoDriver = createInputAdapterDriver({wrapper, dataHook: FIELD_TWO_NAME});

    const getFirstFieldValue = () => formDriver.get.values().array[0].field_one_name;
    const getSecondFieldValue = () => formDriver.get.values().array[0].field_two_name;

    expect(getFirstFieldValue()).toBe('John Snow:formatted');
    expect(getSecondFieldValue()).toBe('Ned Stark:formatted');

    fieldOneDriver.when.change('Tyrion Lannister');
    fieldTwoDriver.when.change('Arya Stark');

    expect(getFirstFieldValue()).toBe('Tyrion Lannister:formatted');
    expect(getSecondFieldValue()).toBe('Arya Stark:formatted');

    formDriver.when.submit();

    expect(onValidate).toBeCalledWith({
      array: [{
        field_one_name: 'Tyrion Lannister:formatted',
        field_two_name: 'Arya Stark:formatted'
      }]
    });
  });
});
