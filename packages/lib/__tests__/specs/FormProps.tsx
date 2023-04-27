import {cleanup, render} from '@testing-library/react';
import React from 'react';
import {TestForm} from '../components/TestForm';
import {Input} from '../components/Input';
import {Field} from '../../src';
import {createTestFormDriver} from '../components/TestForm.driver';
import {createInputDriver} from '../components/Input/createInputDriver';

describe('Form props', () => {
  afterEach(() => cleanup());

  it('initialValues', async () => {
    const wrapper = render(
      <TestForm
        initialValues={{
          string: 'John Snow',
          nested: [
            {
              id: 'Jaime Lannister',
            },
          ],
        }}
      >
        <div>
          <Field name="string">
            <Input />
          </Field>
          <Field name="nested[0].id">
            <Input />
          </Field>
        </div>
      </TestForm>,
    ).container;

    const fieldDriverOne = createInputDriver({wrapper, dataHook: 'string'});
    const fieldDriverNested = createInputDriver({wrapper, dataHook: 'nested[0].id'});

    expect(fieldDriverOne.get.value()).toBe('John Snow');
    expect(fieldDriverNested.get.value()).toBe('Jaime Lannister');
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
              field_two_name: 'Ned Stark',
            },
          ],
        }}
        onValidate={onValidate}
        onFormat={(values: any) => {
          const formattedValues = {...values};

          if (formattedValues.array) {
            const value = formattedValues.array[0].field_one_name;
            formattedValues.array[0].field_one_name = value?.endsWith(':formatted') ? value : `${value}:formatted`;
          }

          return formattedValues;
        }}
      >
        <Field name={FIELD_ONE_NAME}>
          <Input />
        </Field>
        <Field
          name={FIELD_TWO_NAME}
          onFormat={(value: string) => {
            return value?.endsWith(':formatted') ? value : `${value}:formatted`;
          }}
        >
          <Input />
        </Field>
      </TestForm>,
    ).container;

    const formDriver = createTestFormDriver({wrapper});
    const fieldOneDriver = createInputDriver({wrapper, dataHook: FIELD_ONE_NAME});
    const fieldTwoDriver = createInputDriver({wrapper, dataHook: FIELD_TWO_NAME});

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
      array: [
        {
          field_one_name: 'Tyrion Lannister:formatted',
          field_two_name: 'Arya Stark:formatted',
        },
      ],
    });
  });
});
